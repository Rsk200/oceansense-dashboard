from __future__ import annotations

import json
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
from sklearn.decomposition import PCA
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from torch import nn
from xgboost import XGBRegressor

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from api.config import (  # noqa: E402
    DROPOUT,
    ENSO_MODEL_DIR,
    ENSO_SEQ_LEN,
    FEATURES_HYBRID,
    GLOBAL_CSV,
    LOCAL_CSV,
    LSTM_HIDDEN,
    LSTM_LAYERS,
    MODELS_DIR,
    PCA_COMPONENTS,
    SEQ_LEN,
    STATION_DIRS,
    STATIONS,
    TARGET,
    WATER_MODEL_DIR,
    XGB_CLIMATE_FEATS,
)
from api.ml.hybrid_model import XGBoostLSTMHybrid  # noqa: E402

SEED = 42
torch.manual_seed(SEED)
np.random.seed(SEED)


def _ensure_dirs() -> None:
    ENSO_MODEL_DIR.mkdir(parents=True, exist_ok=True)
    WATER_MODEL_DIR.mkdir(parents=True, exist_ok=True)
    for folder in STATION_DIRS.values():
        (WATER_MODEL_DIR / folder).mkdir(parents=True, exist_ok=True)


def export_enso() -> None:
    print("Loading global CSV...")
    df = pd.read_csv(GLOBAL_CSV, parse_dates=["Time"])
    features = ["sst", "sometauy", "sozotaux", "votemper_surface", "sohtc300", "sohtc700", "slp", "olr"]
    target = "nino3.4 anomaly"

    grids: list[np.ndarray] = []
    targets: list[float] = []
    for _, temp_df in df.sort_values(["Time", "Latitude", "Longitude"]).groupby("Time", sort=True):
        grid = temp_df.pivot(index="Latitude", columns="Longitude", values=features)
        grids.append(grid.values)
        targets.append(float(temp_df[target].iloc[0]))

    data_array = np.nan_to_num(np.array(grids, dtype=np.float32))
    data_flat = data_array.reshape(data_array.shape[0], -1)
    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(data_flat)
    pca = PCA(n_components=PCA_COMPONENTS, random_state=SEED, svd_solver="randomized")
    data_pca = pca.fit_transform(data_scaled)

    X, y = [], []
    target_array = np.array(targets, dtype=np.float32)
    for i in range(len(data_pca) - ENSO_SEQ_LEN):
        X.append(data_pca[i : i + ENSO_SEQ_LEN].flatten())
        y.append(target_array[i + ENSO_SEQ_LEN])
    X_arr = np.array(X, dtype=np.float32)
    y_arr = np.array(y, dtype=np.float32)

    model = XGBRegressor(
        n_estimators=600,
        learning_rate=0.04,
        max_depth=4,
        subsample=0.85,
        colsample_bytree=0.85,
        objective="reg:squarederror",
        random_state=SEED,
        verbosity=1,
    )
    print(f"Training ENSO XGBoost on {X_arr.shape}...")
    model.fit(X_arr, y_arr)

    joblib.dump(scaler, ENSO_MODEL_DIR / "scaler.joblib")
    joblib.dump(pca, ENSO_MODEL_DIR / "pca.joblib")
    joblib.dump(model, ENSO_MODEL_DIR / "xg_model.joblib")
    np.save(ENSO_MODEL_DIR / "last_input.npy", X_arr[-1:].astype(np.float32))
    (ENSO_MODEL_DIR / "last_time.txt").write_text(str(df["Time"].max().date()), encoding="utf-8")
    print(f"Saved ENSO artifacts to {ENSO_MODEL_DIR}")


def _monthly_local() -> pd.DataFrame:
    raw = pd.read_csv(LOCAL_CSV, parse_dates=["DATE"])
    monthly_stations: list[pd.DataFrame] = []
    for station_id, meta in STATIONS.items():
        sub = raw[(raw["LAT"] == meta["lat"]) & (raw["LON"] == meta["lon"])].copy()
        sub = sub.set_index("DATE").sort_index()
        monthly = sub.resample("MS").mean(numeric_only=True)
        monthly = monthly.interpolate(method="linear", limit=2).dropna()
        monthly["MONTH"] = monthly.index.month
        monthly["YEAR"] = monthly.index.year
        monthly["STATION"] = station_id
        monthly["LAT"] = float(meta["lat"])
        monthly["LON"] = float(meta["lon"])
        monthly_stations.append(monthly.reset_index())

    df = pd.concat(monthly_stations, ignore_index=True)
    df = df.sort_values(["STATION", "DATE"]).reset_index(drop=True)
    df["month_sin"] = np.sin(2 * np.pi * df["MONTH"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["MONTH"] / 12)
    for lag, col in [(1, "WL_LAG1"), (2, "WL_LAG2"), (3, "WL_LAG3")]:
        df[col] = df.groupby("STATION")[TARGET].shift(lag)
    for win, col in [(3, "WL_ROLL3"), (6, "WL_ROLL6")]:
        df[col] = df.groupby("STATION")[TARGET].transform(lambda x: x.shift(1).rolling(win, min_periods=1).mean())
    df["RAIN_ANOMALY"] = df.groupby("STATION")["PRECTOTCORR"].transform(lambda x: x - x.mean())
    return df.dropna().reset_index(drop=True)


def _make_sequences(features: np.ndarray, target: np.ndarray) -> tuple[torch.Tensor, torch.Tensor]:
    xs, ys = [], []
    for i in range(len(features) - SEQ_LEN):
        xs.append(features[i : i + SEQ_LEN])
        ys.append(target[i + SEQ_LEN])
    return (
        torch.tensor(np.array(xs), dtype=torch.float32),
        torch.tensor(np.array(ys).reshape(-1, 1), dtype=torch.float32),
    )


def export_water_level() -> None:
    df = _monthly_local()
    rmse: dict[str, float] = {}
    for station_id, folder in STATION_DIRS.items():
        print(f"Training water-level artifacts for {station_id}...")
        station_dir = WATER_MODEL_DIR / folder
        sub = df[df["STATION"] == station_id].sort_values("DATE").reset_index(drop=True)
        cut = int(len(sub) * 0.8)
        train = sub.iloc[:cut].copy()
        test = sub.iloc[cut:].copy()

        xgb_sub = XGBRegressor(
            n_estimators=500,
            learning_rate=0.04,
            max_depth=5,
            subsample=0.85,
            colsample_bytree=0.85,
            objective="reg:squarederror",
            random_state=SEED,
            verbosity=0,
        )
        xgb_sub.fit(train[XGB_CLIMATE_FEATS], train[TARGET])

        x_scaler = StandardScaler().fit(train[FEATURES_HYBRID])
        y_scaler = StandardScaler().fit(train[[TARGET]])
        train_x = x_scaler.transform(train[FEATURES_HYBRID])
        train_y = y_scaler.transform(train[[TARGET]]).flatten()
        test_x = x_scaler.transform(test[FEATURES_HYBRID])
        test_y = y_scaler.transform(test[[TARGET]]).flatten()

        X_train, y_train = _make_sequences(train_x, train_y)
        X_test, y_test = _make_sequences(test_x, test_y)
        xgb_train_pred = xgb_sub.predict(train.iloc[SEQ_LEN:][XGB_CLIMATE_FEATS]).reshape(-1, 1)
        xgb_train = torch.tensor(xgb_train_pred, dtype=torch.float32)

        model = XGBoostLSTMHybrid(n_features=len(FEATURES_HYBRID))
        optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-4)
        loss_fn = nn.HuberLoss()
        model.train()
        for epoch in range(120):
            optimizer.zero_grad()
            pred, _ = model(X_train, xgb_train)
            loss = loss_fn(pred, y_train)
            loss.backward()
            optimizer.step()
            if (epoch + 1) % 30 == 0:
                print(f"  epoch {epoch + 1:03d} loss={loss.item():.4f}")

        model.eval()
        with torch.no_grad():
            if len(X_test) > 0:
                xgb_test_pred = xgb_sub.predict(test.iloc[SEQ_LEN:][XGB_CLIMATE_FEATS]).reshape(-1, 1)
                pred_sc, _ = model(X_test, torch.tensor(xgb_test_pred, dtype=torch.float32))
                pred = y_scaler.inverse_transform(pred_sc.numpy()).flatten()
                true = y_scaler.inverse_transform(y_test.numpy()).flatten()
                station_rmse = float(np.sqrt(mean_squared_error(true, pred)))
            else:
                station_rmse = float(sub[TARGET].std())

        torch.save(model.state_dict(), station_dir / "hybrid_model.pt")
        joblib.dump(x_scaler, station_dir / "x_scaler.joblib")
        joblib.dump(y_scaler, station_dir / "y_scaler.joblib")
        joblib.dump(xgb_sub, station_dir / "xgb_sub.joblib")
        sub.to_csv(station_dir / "history.csv", index=False)
        rmse[station_id] = max(station_rmse, 0.01)
        print(f"Saved {station_id} artifacts with RMSE {rmse[station_id]:.4f}")

    (MODELS_DIR / "rmse.json").write_text(json.dumps(rmse, indent=2), encoding="utf-8")


def main() -> None:
    _ensure_dirs()
    export_enso()
    export_water_level()
    print("All model artifacts exported.")


if __name__ == "__main__":
    main()
