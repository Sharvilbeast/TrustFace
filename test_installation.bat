@echo off
echo TrustFace 2.0 Installation Test
echo ==============================
echo.

echo Testing Python installation...
python --version
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    pause
    exit /b 1
)

echo.
echo Testing Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

echo.
echo Testing virtual environment...
if not exist "venv" (
    echo Virtual environment not found.
    echo Please run the fix_issues.bat script first.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scriptsctivate

echo.
echo Testing face_recognition module...
python -c "import face_recognition; print('face_recognition module is working!')"
if %errorlevel% neq 0 (
    echo face_recognition module is not working.
    echo Please run the fix_issues.bat script.
    pause
    exit /b 1
)

echo.
echo Testing other Python modules...
python -c "import fastapi, uvicorn, cv2, numpy, PIL, sqlalchemy, jose, passlib, dotenv, pandas, sklearn; print('All Python modules are working!')"
if %errorlevel% neq 0 (
    echo Some Python modules are not working.
    echo Please run the fix_issues.bat script.
    pause
    exit /b 1
)

deactivate

echo.
echo Testing frontend...
cd frontend
if not exist "node_modules" (
    echo Frontend dependencies not installed.
    echo Please run the fix_issues.bat script.
    cd ..
    pause
    exit /b 1
)

echo Testing react-scripts...
npx react-scripts --version
if %errorlevel% neq 0 (
    echo react-scripts is not working.
    echo Please run the fix_issues.bat script.
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo =================================
echo All tests passed successfully!
echo =================================
echo.
echo You can now run the application:
echo 1. Activate the virtual environment: venv\Scriptsctivate
echo 2. Run the start script: start.bat
echo.
echo Or you can run manually:
echo Backend: cd backend && python app.py
echo Frontend: cd frontend && npm start
echo.
pause
