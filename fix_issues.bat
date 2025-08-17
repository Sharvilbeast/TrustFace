@echo off
echo TrustFace 2.0 Issues Fixer
echo =========================
echo.

echo This script will fix the specific issues you're experiencing:
echo 1. ModuleNotFoundError: No module named 'face_recognition'
echo 2. 'react-scripts' is not recognized
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo Failed to create virtual environment.
        echo Please make sure Python is installed and in PATH.
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scriptsctivate

echo.
echo Installing face_recognition...
echo.

REM Try installing face_recognition directly
pip install face-recognition
if %errorlevel% neq 0 (
    echo Failed to install face_recognition directly.
    echo.
    echo Trying to install dlib first...
    pip install dlib
    if %errorlevel% neq 0 (
        echo Failed to install dlib.
        echo.
        echo Trying with pre-compiled dlib...
        if not exist "downloads" mkdir downloads
        if not exist "downloads\dlib-19.22.99-cp39-cp39-win_amd64.whl" (
            echo Downloading pre-compiled dlib...
            powershell -Command "Invoke-WebRequest -Uri 'https://files.pythonhosted.org/packages/62/93/9865b9d97a3cc9f30a9a5c3e8c8ae6e0d4d1a5d8e8c7d6b5a4c3e2d1f0d0/dlib-19.22.99-cp39-cp39-win_amd64.whl' -OutFile 'downloads/dlib-19.22.99-cp39-cp39-win_amd64.whl'"
            if %errorlevel% neq 0 (
                echo Failed to download dlib.
                echo.
                echo Please download it manually from:
                echo https://pypi.org/project/dlib/#files
                echo.
                echo Look for a file named dlib-19.22.99-cp39-win_amd64.whl
                echo or a version compatible with your Python installation.
                echo.
                echo Save it in the downloads folder and run this script again.
                pause
                exit /b 1
            )
        )
        echo Installing pre-compiled dlib...
        pip install downloads\dlib-19.22.99-cp39-win_amd64.whl
        if %errorlevel% neq 0 (
            echo Failed to install pre-compiled dlib.
            pause
            exit /b 1
        )
    )
    echo Installing face_recognition again...
    pip install face-recognition
    if %errorlevel% neq 0 (
        echo Failed to install face_recognition.
        pause
        exit /b 1
    )
)

echo face_recognition installed successfully.
echo.

REM Install other required Python packages
echo Installing other required Python packages...
pip install fastapi uvicorn python-multipart opencv-python numpy Pillow SQLAlchemy python-jose[cryptography] passlib[bcrypt] python-dotenv pandas scikit-learn
if %errorlevel% neq 0 (
    echo Failed to install some Python packages.
    pause
    exit /b 1
)

echo Python packages installed successfully.
echo.

deactivate

echo.
echo Installing react-scripts...
echo.

REM Check if we're in the right directory for frontend
if not exist "frontend\package.json" (
    echo frontend directory not found or package.json is missing.
    pause
    exit /b 1
)

cd frontend

REM Install react-scripts directly
npm install react-scripts
if %errorlevel% neq 0 (
    echo Failed to install react-scripts.
    echo.
    echo Trying to clear npm cache and retry...
    npm cache clean --force
    npm install react-scripts
    if %errorlevel% neq 0 (
        echo Failed to install react-scripts after clearing cache.
        echo.
        echo Trying full npm install...
        npm install
        if %errorlevel% neq 0 (
            echo Failed to install frontend dependencies.
            cd ..
            pause
            exit /b 1
        )
    )
)

echo react-scripts installed successfully.
echo.

cd ..

echo.
echo =================================
echo Issues fixed successfully!
echo =================================
echo.
echo Now you can run the application:
echo 1. Activate the virtual environment: venv\Scriptsctivate
echo 2. Run the start script: start.bat
echo.
echo Or you can run manually:
echo Backend: cd backend && python app.py
echo Frontend: cd frontend && npm start
echo.
pause
