from api.ml.hybrid_model import HybridForecastService
import os
os.environ['OCEANSENSE_REQUIRE_ARTIFACTS'] = '1'

service = HybridForecastService.load()

# Test various PRECTOTCORR and RAIN_ANOMALY
manual_chain = [
    {
        "enso_index": 2.0,
        "PRECTOTCORR": 100.0,
        "RAIN_ANOMALY": 50.0,
        "GWETROOT": 1.5,
    }
] * 12

res = service.forecast_station_manual('Station-A', manual_chain, 2026)
for row in res:
    print(row['month'], row['predicted_water_level_m'], row['risk_label'])
