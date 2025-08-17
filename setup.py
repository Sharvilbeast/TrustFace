
import os
import sys
import subprocess
import platform
import venv

def run_command(command, cwd=None):
    """Run a command and return the output"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE, 
                              text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error message: {e.stderr}")
        return None

def create_virtual_env():
    """Create a virtual environment"""
    print("Creating virtual environment...")
    venv.create("venv", with_pip=True)
    print("Virtual environment created successfully!")

def get_python_executable():
    """Get the path to the Python executable in the virtual environment"""
    if platform.system() == "Windows":
        return os.path.join("venv", "Scripts", "python.exe")
    else:
        return os.path.join("venv", "bin", "python")

def get_pip_executable():
    """Get the path to the pip executable in the virtual environment"""
    if platform.system() == "Windows":
        return os.path.join("venv", "Scripts", "pip.exe")
    else:
        return os.path.join("venv", "bin", "pip")

def install_python_dependencies():
    """Install Python dependencies"""
    print("Installing Python dependencies...")
    pip_executable = get_pip_executable()

    # Upgrade pip first
    run_command(f"{pip_executable} install --upgrade pip")

    # Install wheel
    run_command(f"{pip_executable} install wheel")

    # Install cmake first
    print("Installing cmake...")
    run_command(f"{pip_executable} install cmake")

    # Install dlib (this might take a while)
    print("Installing dlib (this may take several minutes)...")
    run_command(f"{pip_executable} install dlib")

    # Install the rest of the dependencies
    print("Installing remaining dependencies...")
    run_command(f"{pip_executable} install -r requirements.txt")

    print("Python dependencies installed successfully!")

def install_node_dependencies():
    """Install Node.js dependencies"""
    print("Installing Node.js dependencies...")

    # Check if npm is installed
    try:
        subprocess.run(["npm", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("npm is not installed. Please install Node.js from https://nodejs.org/")
        return False

    # Install frontend dependencies
    os.chdir("frontend")
    run_command("npm install")
    os.chdir("..")

    print("Node.js dependencies installed successfully!")
    return True

def install_system_dependencies():
    """Install system dependencies based on the platform"""
    system = platform.system()

    if system == "Windows":
        print("On Windows, please ensure you have installed:")
        print("1. Visual Studio Build Tools with C++ support")
        print("   Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/")
        print("2. CMake")
        print("   Download from: https://cmake.org/download/")
        print("Make sure to select 'Add CMake to the system PATH' during installation")

        input("Press Enter after you have installed these dependencies...")

    elif system == "Darwin":  # macOS
        print("Installing macOS dependencies...")
        # Install Xcode Command Line Tools
        run_command("xcode-select --install")
        # Install Homebrew if not already installed
        try:
            subprocess.run(["brew", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("Installing Homebrew...")
            run_command('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"')
        # Install cmake via Homebrew
        run_command("brew install cmake")

    elif system == "Linux":
        print("Installing Linux dependencies...")
        # Try to detect the package manager
        try:
            subprocess.run(["apt-get", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            # Debian/Ubuntu
            run_command("sudo apt-get update")
            run_command("sudo apt-get install -y build-essential cmake python3-dev python3-pip")
        except (subprocess.CalledProcessError, FileNotFoundError):
            try:
                subprocess.run(["dnf", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                # Fedora
                run_command("sudo dnf install -y gcc-c++ cmake python3-devel python3-pip")
            except (subprocess.CalledProcessError, FileNotFoundError):
                try:
                    subprocess.run(["yum", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                    # CentOS/RHEL
                    run_command("sudo yum groupinstall -y 'Development Tools'")
                    run_command("sudo yum install -y cmake python3-devel python3-pip")
                except (subprocess.CalledProcessError, FileNotFoundError):
                    print("Could not detect package manager. Please install build-essential, cmake, python3-dev, and python3-pip manually.")

def main():
    print("TrustFace 2.0 Setup Script")
    print("===========================")

    # Install system dependencies
    print("Step 1: Installing system dependencies...")
    install_system_dependencies()

    # Create virtual environment
    print("
Step 2: Creating virtual environment...")
    create_virtual_env()

    # Install Python dependencies
    print("
Step 3: Installing Python dependencies...")
    install_python_dependencies()

    # Install Node.js dependencies
    print("
Step 4: Installing Node.js dependencies...")
    if not install_node_dependencies():
        print("Failed to install Node.js dependencies. Please install Node.js manually.")
        return

    print("
Setup completed successfully!")
    print("
To run the application:")
    print("1. Activate the virtual environment:")
    if platform.system() == "Windows":
        print("   venv\Scripts\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Run the start script:")
    print("   Windows: start.bat")
    print("   Linux/macOS: ./start.sh")
    print("
Or you can run manually:")
    print("Backend: cd backend && python app.py")
    print("Frontend: cd frontend && npm start")

if __name__ == "__main__":
    main()
