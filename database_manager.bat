@echo off
echo TrustFace 2.0 Database Manager
echo =============================
echo.

echo Choose an option:
echo.
echo 1. Complete Reset (Remove database and all files)
echo 2. Data Only Reset (Remove all data but keep table structure)
echo 3. Exit
echo.

set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" (
    echo.
    echo Complete Reset Selected
    echo ======================
    echo.
    echo This will remove the entire database file and all uploaded files.
    echo This action cannot be undone.
    echo.
    set /p confirm=Are you sure you want to proceed? (y/n): 
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
    echo Complete database reset finished!
    echo The application will create a new empty database when started.

) else if "%choice%"=="2" (
    echo.
    echo Data Only Reset Selected
    echo ======================
    echo.
    echo This will remove all data from the database but keep the table structure.
    echo It will also remove all uploaded files.
    echo This action cannot be undone.
    echo.
    set /p confirm=Are you sure you want to proceed? (y/n): 
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
    echo Resetting database data...
    cd backend
    python reset_database.py
    cd ..

) else if "%choice%"=="3" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
)

echo.
echo Operation completed successfully!
echo.
pause
