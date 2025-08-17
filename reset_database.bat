@echo off
echo TrustFace 2.0 Database Reset
echo ===========================
echo.

echo This script will reset the database and remove all data.
echo This action cannot be undone.
echo.

set /p confirm=Are you sure you want to reset the database? (y/n): 
if /i "%confirm%" neq "y" (
    echo Database reset cancelled.
    pause
    exit /b 0
)

echo.
echo Stopping any running instances of the application...
taskkill /f /im python.exe > nul 2>&1
taskkill /f /im node.exe > nul 2>&1

echo.
echo Removing database file...
if exist "backend\trustface.db" (
    del "backend\trustface.db"
    echo Database file removed.
) else (
    echo Database file not found.
)

echo.
echo Removing uploaded files...
if exist "backend\uploads" (
    rd /s /q "backend\uploads"
    echo Uploads directory removed.
) else (
    echo Uploads directory not found.
)

echo.
echo Removing known faces...
if exist "backend\known_faces" (
    rd /s /q "backend\known_faces"
    echo Known faces directory removed.
) else (
    echo Known faces directory not found.
)

echo.
echo Recreating directories...
mkdir "backend\uploads" 2>nul
mkdir "backend\known_faces" 2>nul
echo Directories recreated.

echo.
echo Database reset completed successfully!
echo.
echo The application will create a new empty database when started.
echo.
pause
