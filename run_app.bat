@echo off
echo TrustFace 2.0 Application Runner
echo ===============================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Virtual environment not found.
    echo Please run the fix_issues.bat script first.
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scriptsctivate

REM Check if backend directory exists
if not exist "backendpp.py" (
    echo Backend application not found.
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend\package.json" (
    echo Frontend application not found.
    pause
    exit /b 1
)

REM Start backend in a new window
echo Starting backend server...
start "TrustFace Backend" cmd /k "cd /d %~dp0backend && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
echo Starting frontend server...
start "TrustFace Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo =================================
echo TrustFace 2.0 is starting...
echo =================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
