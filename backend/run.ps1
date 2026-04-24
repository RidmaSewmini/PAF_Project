# run.ps1 - CampusFlow Backend Launcher (PowerShell)
#
# Reads MONGO_URI from backend/.env and sets it as a process-level
# environment variable before starting Spring Boot via mvnw.
#
# Usage (from PAFProject\backend\):
#     .\run.ps1
#
# If you get an execution policy error, run once:
#     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$EnvFile   = Join-Path $ScriptDir ".env"

# 1. Check .env exists
if (-not (Test-Path $EnvFile)) {
    Write-Host "ERROR: .env file not found at: $EnvFile" -ForegroundColor Red
    Write-Host "Create backend\.env with:  MONGO_URI=your_atlas_connection_string"
    exit 1
}

# 2. Parse .env - skip blank lines and comment lines (#)
Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#')) {
        $idx = $line.IndexOf('=')
        if ($idx -gt 0) {
            $key   = $line.Substring(0, $idx).Trim()
            $value = $line.Substring($idx + 1).Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "[ENV] $key loaded (length $($value.Length) chars)"
        }
    }
}

# 3. Verify MONGO_URI was loaded
$mongoUri = [System.Environment]::GetEnvironmentVariable('MONGO_URI', 'Process')
if (-not $mongoUri) {
    Write-Host "ERROR: MONGO_URI not found in $EnvFile" -ForegroundColor Red
    Write-Host "Make sure the file contains:  MONGO_URI=mongodb+srv://..."
    exit 1
}

# 4. Start the backend
Write-Host ""
Write-Host "[OK] MONGO_URI resolved - starting backend on port 8080..." -ForegroundColor Green
Write-Host ""

$mvnw = Join-Path $ScriptDir "mvnw.cmd"
& cmd.exe /c "`"$mvnw`" spring-boot:run"
