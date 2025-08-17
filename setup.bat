@echo off
echo TrustFace 2.0 Setup
echo ==================
echo.

echo This script will set up the entire TrustFace 2.0 project in a virtual environment.
echo It may take several minutes to complete, especially when installing dlib.
echo.

pause

echo Running setup script...
python setup.py

echo.
echo Setup completed!
echo.
echo To run the application:
echo 1. Activate the virtual environment: venv\Scripts\activate
echo 2. Run the start script: start.bat
echo.
pause
