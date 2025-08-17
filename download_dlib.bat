@echo off
echo Downloading pre-compiled dlib package...
echo.

REM Create a directory for downloads if it doesn't exist
if not exist "downloads" mkdir downloads

REM Download pre-compiled dlib
echo Downloading dlib-19.22.99-cp39-cp39-win_amd64.whl...
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
    echo Save it in the downloads folder.
    pause
    exit /b 1
)

echo Download completed successfully.
echo.
echo The file has been saved in the downloads folder.
echo.
pause
