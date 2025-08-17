
# Windows Installation Guide for TrustFace 2.0

This guide provides step-by-step instructions specifically for Windows users to install TrustFace 2.0.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Python 3.8 or higher**
   - Download from: https://www.python.org/downloads/
   - During installation, make sure to check "Add Python to PATH"

2. **Node.js 14 or higher**
   - Download from: https://nodejs.org/
   - This will also install npm (Node Package Manager)

## Step-by-Step Installation

### Step 1: Install Visual Studio Build Tools

This is required for compiling dlib, which is a dependency of face_recognition.

1. Download Visual Studio Build Tools from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Run the installer
3. Select "Desktop development with C++" workload
4. Click "Install" and wait for the installation to complete

### Step 2: Install CMake

1. Download CMake from: https://cmake.org/download/
2. Run the installer
3. Make sure to select "Add CMake to the system PATH" during installation
4. Complete the installation

### Step 3: Create a Virtual Environment

1. Open Command Prompt as Administrator
2. Navigate to the project directory:
   ```
   cd "C:/Users/patil/OneDrive/Desktop/All project/TrustFace 2.0"
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   ```
   venv\Scriptsctivate
   ```

### Step 4: Install Python Dependencies

1. With the virtual environment still active, upgrade pip:
   ```
   pip install --upgrade pip
   ```
2. Install wheel:
   ```
   pip install wheel
   ```
3. Install cmake:
   ```
   pip install cmake
   ```
4. Install dlib (this may take several minutes):
   ```
   pip install dlib
   ```
5. Install the remaining Python packages:
   ```
   pip install -r requirements.txt
   ```

### Step 5: Install Frontend Dependencies

1. Open a new Command Prompt (not as Administrator)
2. Navigate to the frontend directory:
   ```
   cd "C:/Users/patil/OneDrive/Desktop/All project/TrustFace 2.0/frontend"
   ```
3. Install the required packages:
   ```
   npm install
   ```

## Running the Application

### Method 1: Using Start Scripts

1. For the backend:
   - Open Command Prompt
   - Navigate to the project directory
   - Activate the virtual environment: `venv\Scriptsctivate`
   - Run: `cd backend && python app.py`

2. For the frontend:
   - Open a new Command Prompt
   - Navigate to the frontend directory: `cd "C:/Users/patil/OneDrive/Desktop/All project/TrustFace 2.0/frontend"`
   - Run: `npm start`

### Method 2: Using the Provided Batch File

1. Double-click the `start.bat` file in the project root directory
2. This will open two terminal windows - one for the backend and one for the frontend

## Troubleshooting

### "ModuleNotFoundError: No module named 'face_recognition'"

1. Make sure you've followed all steps above, especially installing Visual Studio Build Tools and CMake
2. Ensure your virtual environment is activated
3. Try installing dlib separately:
   ```
   pip install dlib
   ```
4. Then install face_recognition:
   ```
   pip install face-recognition
   ```

### "dlib installation failed"

1. Make sure Visual Studio Build Tools with C++ support is installed
2. Make sure CMake is installed and added to PATH
3. Try installing a pre-compiled version of dlib:
   ```
   pip install --upgrade pip
   pip install dlib-19.22.99-cp39-cp39-win_amd64.whl
   ```

### "'react-scripts' is not recognized"

1. Make sure you're in the frontend directory when running npm commands
2. Try installing react-scripts directly:
   ```
   cd frontend
   npm install react-scripts
   ```
3. If that fails, try clearing the npm cache:
   ```
   npm cache clean --force
   npm install
   ```

### Port Already in Use

If you get an error that a port is already in use:

1. For backend (port 8000):
   - In `backend/app.py`, change the port number in the uvicorn.run line

2. For frontend (port 3000):
   - In `frontend/package.json`, modify the start script to:
     ```
     "start": "set PORT=3001 && react-scripts start"
     ```

## Alternative: Using Pre-compiled Packages

If you're still having issues with dlib, you can try using a pre-compiled version:

1. Download a pre-compiled dlib wheel from: https://pypi.org/project/dlib/#files
2. Make sure to download the version that matches your Python version and system architecture (e.g., dlib-19.22.99-cp39-cp39-win_amd64.whl for Python 3.9 on 64-bit Windows)
3. Install it using:
   ```
   pip install path/to/downloaded/dlib.whl
   ```
4. Then install face_recognition:
   ```
   pip install face-recognition
   ```

## Support

If you're still having issues after following these steps, please check the following:
1. Ensure all prerequisites are installed correctly
2. Make sure you're running commands in the correct directories
3. Check that your virtual environment is activated when running Python commands
