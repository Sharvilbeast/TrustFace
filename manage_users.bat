@echo off
echo TrustFace 2.0 User Manager
echo ==========================
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
if not exist "backend\user_manager.py" (
    echo User manager script not found.
    pause
    exit /b 1
)

REM Run the user manager
echo Starting User Manager...
cd backend
python user_manager.py
cd ..

echo.
echo User Manager closed.
pause
