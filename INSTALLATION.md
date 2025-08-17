# TrustFace 2.0 Installation Guide

This guide provides detailed instructions for installing and setting up the TrustFace 2.0 application.

## Prerequisites

Before installing TrustFace 2.0, ensure you have the following installed:

1. **Python 3.8 or higher**
   - Download from: https://www.python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

2. **Node.js 14 or higher**
   - Download from: https://nodejs.org/
   - This will also install npm (Node Package Manager)

3. **Git** (optional, for cloning the repository)
   - Download from: https://git-scm.com/

## Windows Installation

### Step 1: Install CMake

The `face-recognition` library requires CMake to build dlib. Follow these steps:

1. Download CMake from: https://cmake.org/download/
2. Run the installer and follow the installation wizard
3. Make sure to select "Add CMake to the system PATH" during installation

### Step 2: Install Visual Studio Build Tools

Dlib requires a C++ compiler. Install Visual Studio Build Tools:

1. Download Visual Studio Build Tools from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Run the installer
3. Select "Desktop development with C++" workload
4. Install

### Step 3: Set Up the Project

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
   venv\Scripts\activate
   ```
5. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

### Step 4: Install Frontend Dependencies

1. Open a new Command Prompt
2. Navigate to the frontend directory:
   ```
   cd "C:/Users/patil/OneDrive/Desktop/All project/TrustFace 2.0/frontend"
   ```
3. Install the required packages:
   ```
   npm install
   ```

## macOS Installation

### Step 1: Install Homebrew

Homebrew is a package manager for macOS. Install it by running:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install Dependencies

1. Open Terminal
2. Navigate to the project directory:
   ```
   cd "/Users/patil/OneDrive/Desktop/All project/TrustFace 2.0"
   ```
3. Create a virtual environment:
   ```
   python3 -m venv venv
   ```
4. Activate the virtual environment:
   ```
   source venv/bin/activate
   ```
5. Install Xcode Command Line Tools (required for dlib):
   ```
   xcode-select --install
   ```
6. Install CMake:
   ```
   brew install cmake
   ```
7. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

### Step 3: Install Frontend Dependencies

1. Open a new Terminal
2. Navigate to the frontend directory:
   ```
   cd "/Users/patil/OneDrive/Desktop/All project/TrustFace 2.0/frontend"
   ```
3. Install the required packages:
   ```
   npm install
   ```

## Linux Installation (Ubuntu/Debian)

### Step 1: Install System Dependencies

1. Open Terminal
2. Update package lists:
   ```
   sudo apt-get update
   ```
3. Install required system packages:
   ```
   sudo apt-get install build-essential cmake python3-dev python3-pip
   ```

### Step 2: Set Up the Project

1. Navigate to the project directory:
   ```
   cd "/home/patil/OneDrive/Desktop/All project/TrustFace 2.0"
   ```
2. Create a virtual environment:
   ```
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   ```
   source venv/bin/activate
   ```
4. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

### Step 3: Install Frontend Dependencies

1. Open a new Terminal
2. Navigate to the frontend directory:
   ```
   cd "/home/patil/OneDrive/Desktop/All project/TrustFace 2.0/frontend"
   ```
3. Install the required packages:
   ```
   npm install
   ```

## Running the Application

### Using Start Scripts

1. **Windows**:
   - Double-click the `start.bat` file in the project root directory
   - This will open two terminal windows - one for the backend and one for the frontend
   - Wait for both servers to start
   - Open your browser and navigate to `http://localhost:3000`

2. **Linux/macOS**:
   - Open a terminal
   - Navigate to the project directory
   - Run `chmod +x start.sh` to make the script executable
   - Run `./start.sh`
   - This will open two terminal tabs - one for the backend and one for the frontend
   - Wait for both servers to start
   - Open your browser and navigate to `http://localhost:3000`

### Manual Start

1. **Backend**:
   - Open a terminal
   - Navigate to the backend directory
   - Activate the virtual environment if not already activated
   - Run `python app.py`
   - The backend will be running at `http://localhost:8000`

2. **Frontend**:
   - Open a new terminal
   - Navigate to the frontend directory
   - Run `npm start`
   - The frontend will be running at `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **"ModuleNotFoundError: No module named 'face_recognition'"**:
   - Make sure you've installed all requirements with `pip install -r requirements.txt`
   - Ensure your virtual environment is activated
   - On Windows, make sure CMake and Visual Studio Build Tools are installed

2. **"CMake Error"**:
   - Make sure CMake is properly installed and added to PATH
   - On Windows, try installing CMake again and ensure "Add CMake to the system PATH" is selected

3. **"dlib installation failed"**:
   - On Windows, ensure Visual Studio Build Tools with C++ support is installed
   - On macOS, ensure Xcode Command Line Tools are installed with `xcode-select --install`
   - On Linux, ensure build-essential and cmake are installed

4. **Port already in use**:
   - Change the port in the backend (`app.py`) or frontend (`package.json`) if the default ports are already in use

## Support

If you encounter any issues during installation, please check the DEPLOYMENT.md file or contact the development team for assistance.
