$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Python = Join-Path $Root ".venv\Scripts\python.exe"

if (!(Test-Path $Python)) {
    Write-Host "Creating virtual environment..."
    & "C:\Users\Yaad\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m venv (Join-Path $Root ".venv")
}

Write-Host "Installing/updating dependencies..."
& $Python -m pip install -r (Join-Path $Root "requirements.txt")

$RequiredArtifacts = @(
    "models\enso\xg_model.joblib",
    "models\enso\last_input.npy",
    "models\enso\last_time.txt",
    "models\water_level\station_A\hybrid_model.pt",
    "models\water_level\station_B\hybrid_model.pt",
    "models\water_level\station_C\hybrid_model.pt",
    "models\rmse.json"
)

$Missing = $RequiredArtifacts | Where-Object { !(Test-Path (Join-Path $Root $_)) }
if ($Missing.Count -gt 0) {
    Write-Host "Model artifacts are missing. Exporting models now..."
    & $Python (Join-Path $Root "scripts\export_models.py")
}

Write-Host "Stopping old OceanSense processes if present..."
if (Test-Path (Join-Path $Root ".api.pid")) {
    Stop-Process -Id (Get-Content (Join-Path $Root ".api.pid")) -Force -ErrorAction SilentlyContinue
    Remove-Item (Join-Path $Root ".api.pid") -Force -ErrorAction SilentlyContinue
}
if (Test-Path (Join-Path $Root ".frontend.pid")) {
    Stop-Process -Id (Get-Content (Join-Path $Root ".frontend.pid")) -Force -ErrorAction SilentlyContinue
    Remove-Item (Join-Path $Root ".frontend.pid") -Force -ErrorAction SilentlyContinue
}

Write-Host "Starting FastAPI on http://127.0.0.1:8000 ..."
$env:OCEANSENSE_REQUIRE_ARTIFACTS = "1"
$Api = Start-Process -FilePath $Python -ArgumentList @("-m", "uvicorn", "api.main:app", "--host", "127.0.0.1", "--port", "8000") -WorkingDirectory $Root -PassThru -WindowStyle Hidden
$Api.Id | Out-File -FilePath (Join-Path $Root ".api.pid") -Encoding ascii

Write-Host "Waiting for API readiness..."
for ($i = 0; $i -lt 60; $i++) {
    try {
        Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -TimeoutSec 2 | Out-Null
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

$FrontendDir = Join-Path $Root "frontend"
$Npm = "npm.cmd"

if (!(Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Host "Installing frontend dependencies..."
    Push-Location $FrontendDir
    & $Npm install
    Pop-Location
}

Write-Host "Starting React dashboard (Vite dev server) on http://localhost:5173 ..."
$Frontend = Start-Process -FilePath "cmd.exe" -ArgumentList @("/c", "npm", "run", "dev") -WorkingDirectory $FrontendDir -PassThru -WindowStyle Hidden
$Frontend.Id | Out-File -FilePath (Join-Path $Root ".frontend.pid") -Encoding ascii

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "OceanSense is running."
Write-Host "API:       http://127.0.0.1:8000/docs"
Write-Host "Dashboard: http://localhost:5173"
Write-Host "Use .\stop_oceansense.ps1 to stop both services."
