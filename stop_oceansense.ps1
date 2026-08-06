$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

foreach ($PidFile in @(".api.pid", ".frontend.pid")) {
    $Path = Join-Path $Root $PidFile
    if (Test-Path $Path) {
        Stop-Process -Id (Get-Content $Path) -Force -ErrorAction SilentlyContinue
        Remove-Item $Path -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "OceanSense services stopped."
