@echo off
echo TrustFace 2.0 Clear All Data
echo ============================
echo.

echo This script will remove ALL data from the database including:
echo - All users
echo - All face data
echo - All exam sessions
echo - All uploaded files
echo.

set /p confirm=Are you sure you want to clear ALL data? (y/n): 
if /i "%confirm%" neq "y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo Stopping any running instances of the application...
taskkill /f /im python.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1

echo.
echo Clearing database...
cd backend
python clear_all_data.py
cd ..

echo.
echo All data has been cleared successfully!
echo.
echo You can now register new users with simple username and password.
echo.
pause
