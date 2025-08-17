@echo off
echo TrustFace 2.0 Complete Installation
echo =================================
echo.

echo This script will install everything needed for TrustFace 2.0.
echo It will download a pre-compiled version of dlib to avoid compilation issues.
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo Python is installed.
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed.
echo.

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo Failed to create virtual environment.
    pause
    exit /b 1
)

echo Virtual environment created successfully.
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scriptsctivate
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Install wheel
echo Installing wheel...
pip install wheel
echo.

REM Install cmake
echo Installing cmake...
pip install cmake
echo.

REM Create downloads directory if it doesn't exist
if not exist "downloads" mkdir downloads

REM Check if dlib is already downloaded
if exist "downloads\dlib-19.22.99-cp39-cp39-win_amd64.whl" (
    echo Found pre-compiled dlib package.
) else (
    echo Downloading pre-compiled dlib package...
    powershell -Command "Invoke-WebRequest -Uri 'https://files.pythonhosted.org/packages/62/93/9865b9d97a3cc9f30a9a5c3e8c8ae6e0d4d1a5d8e8c7d6b5a4c3e2d1f0d0/dlib-19.22.99-cp39-cp39-win_amd64.whl' -OutFile 'downloads/dlib-19.22.99-cp39-cp39-win_amd64.whl'"

    if %errorlevel% neq 0 (
        echo Failed to download dlib.
        echo.
        echo Please download it manually from:
        echo https://pypi.org/project/dlib/#files
        echo.
        echo Look for a file named dlib-19.22.99-cp39-cp39-win_amd64.whl
        echo or a version compatible with your Python installation.
        echo.
        echo Save it in the downloads folder and run this script again.
        pause
        exit /b 1
    )
)

echo Installing dlib from pre-compiled package...
pip install downloads\dlib-19.22.99-cp39-cp39-win_amd64.whl
if %errorlevel% neq 0 (
    echo Failed to install dlib.
    echo.
    echo Trying to install from PyPI...
    pip install dlib
    if %errorlevel% neq 0 (
        echo Failed to install dlib from PyPI as well.
        echo.
        echo Please make sure you have Visual Studio Build Tools installed.
        echo Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
        echo Select "Desktop development with C++" workload during installation.
        echo.
        pause
        exit /b 1
    )
)

echo dlib installed successfully.
echo.

REM Install face_recognition
echo Installing face_recognition...
pip install face-recognition
if %errorlevel% neq 0 (
    echo Failed to install face_recognition.
    pause
    exit /b 1
)

echo face_recognition installed successfully.
echo.

REM Install other Python dependencies
echo Installing other Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install some Python dependencies.
    pause
    exit /b 1
)

echo Python dependencies installed successfully.
echo.

REM Deactivate virtual environment
deactivate

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies.
    echo Trying to clear npm cache and retry...
    npm cache clean --force
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install frontend dependencies after clearing cache.
        cd ..
        pause
        exit /b 1
    )
)

echo Frontend dependencies installed successfully.
cd ..

echo.
echo =================================
echo Installation completed successfully!
echo =================================
echo.
echo To run the application:
echo 1. Activate the virtual environment: venv\Scriptsctivate
echo 2. Run the start script: start.bat
echo.
echo Or you can run manually:
echo Backend: cd backend && python app.py
echo Frontend: cd frontend && npm start
echo.
pause
