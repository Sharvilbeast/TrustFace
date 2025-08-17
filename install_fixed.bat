@echo off
echo TrustFace 2.0 Windows Installation
echo =================================
echo.

echo This script will guide you through the installation process.
echo Please follow the instructions carefully.
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
call venv\Scripts\activate
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Upgrade setuptools
echo Upgrading setuptools...
python -m pip install --upgrade setuptools
echo.

REM Install wheel
echo Installing wheel...
pip install wheel
echo.

REM Install cmake
echo Installing cmake...
pip install cmake
echo.

REM Install dlib
echo Installing dlib (this may take several minutes)...
pip install https://github.com/omwaman1/dlib/releases/download/dlib/dlib-19.24.99-cp313-cp313-win_amd64.whl
if %errorlevel% neq 0 (
    echo Failed to install dlib.
    echo.
    echo Please make sure you have Visual Studio Build Tools installed.
    echo Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
    echo Select "Desktop development with C++" workload during installation.
    echo.
    pause
    exit /b 1
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
pip install PyJWT
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
echo Clearing npm cache...
npm cache clean --force
echo Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies.
    cd ..
    pause
    exit /b 1
)

echo Frontend dependencies installed successfully.
cd ..

echo.
echo =================================
echo Installation completed successfully!
echo =================================
echo.
echo To run the application:
echo 1. Activate the virtual environment: venv\Scripts\activate
echo 2. Run the start script: start.bat
echo.
echo Or you can run manually:
echo Backend: cd backend && python app.py
echo Frontend: cd frontend && npm start
echo.
pause