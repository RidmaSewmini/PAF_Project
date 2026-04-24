@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM ─────────────────────────────────────────────────────────────────────────────
REM  run.cmd — CampusFlow Backend Launcher (Windows CMD)
REM
REM  Reads MONGO_URI from backend/.env and exports it as a process-level
REM  environment variable so ${MONGO_URI} in application.properties resolves
REM  correctly — without hardcoding secrets or using external libraries.
REM
REM  Usage (from PAFProject\backend\):
REM      run.cmd
REM
REM  Usage (from PAFProject\):
REM      backend\run.cmd
REM ─────────────────────────────────────────────────────────────────────────────

SET "ENV_FILE=%~dp0.env"

IF NOT EXIST "%ENV_FILE%" (
    echo ERROR: .env file not found at %ENV_FILE%
    echo Create backend\.env with: MONGO_URI=your_atlas_connection_string
    exit /b 1
)

REM Parse .env — skip blank lines and lines beginning with #
FOR /f "usebackq tokens=1,* delims==" %%K IN ("%ENV_FILE%") DO (
    SET "LINE=%%K"
    REM Skip empty lines
    IF NOT "!LINE!"=="" (
        REM Skip comment lines (first char is #)
        SET "FIRSTCHAR=!LINE:~0,1!"
        IF NOT "!FIRSTCHAR!"=="#" (
            REM Valid KEY=VALUE — set it in the environment
            SET "%%K=%%L"
        )
    )
)

REM Verify the critical variable was loaded
IF "!MONGO_URI!"=="" (
    echo ERROR: MONGO_URI was not found in %ENV_FILE%
    echo Make sure the file contains:  MONGO_URI=mongodb+srv://...
    exit /b 1
)

echo [OK] MONGO_URI loaded ^(length=!MONGO_URI:~0,0!!MONGO_URI!^)
echo [  ] Starting CampusFlow backend on port 8080...
echo.

CALL "%~dp0mvnw.cmd" spring-boot:run

ENDLOCAL
