
# TrustFace 2.0 Deployment Guide

This guide provides instructions for deploying the TrustFace 2.0 application for exhibition purposes.

## Quick Start

### Using the Start Scripts

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

## Manual Setup

### Backend Setup

1. Open a terminal or command prompt
2. Navigate to the project directory: `cd "path/to/TrustFace 2.0"`
3. Create a virtual environment: `python -m venv venv`
4. Activate the virtual environment:
   - Windows: `venv\Scriptsctivate`
   - macOS/Linux: `source venv/bin/activate`
5. Install the backend dependencies: `pip install -r requirements.txt`
6. Start the backend server: `cd backend && python app.py`
7. The backend will be running at `http://localhost:8000`

### Frontend Setup

1. Open a new terminal or command prompt
2. Navigate to the frontend directory: `cd "path/to/TrustFace 2.0/frontend"`
3. Install the frontend dependencies: `npm install`
4. Start the frontend development server: `npm start`
5. The frontend will be running at `http://localhost:3000`

## Mobile Device Access

To access the application on a mobile device for exhibition purposes:

1. Ensure your computer and mobile device are on the same network
2. Find your computer's local IP address (usually starts with 192.168.x.x)
   - Windows: Open Command Prompt and type `ipconfig`
   - macOS/Linux: Open Terminal and type `ifconfig` or `ip addr`
3. On your mobile device, open a web browser
4. Navigate to `http://YOUR_IP_ADDRESS:3000` (replace YOUR_IP_ADDRESS with your computer's IP)

## Exhibition Setup

For exhibition purposes, we recommend:

1. Using a laptop or desktop computer with a webcam
2. Ensuring good lighting conditions for face recognition
3. Having a stable internet connection
4. Pre-registering some demo accounts to showcase the functionality
5. Setting up a mobile device to demonstrate the mobile responsiveness

## Cloud Deployment Options

For a more permanent deployment accessible from anywhere:

### Option 1: PythonAnywhere (Simpler)

1. Create a PythonAnywhere account
2. Upload your project files
3. Set up a web app
4. Install the required packages
5. Configure the web app to run your backend

### Option 2: AWS/Google Cloud/Azure (More Advanced)

1. Create an account with your preferred cloud provider
2. Set up a virtual machine or container
3. Deploy your backend as a service
4. Build and deploy your frontend as a static website
5. Configure domain and SSL certificates

### Option 3: Heroku

1. Create a Heroku account
2. Install the Heroku CLI
3. Prepare your application for Heroku deployment
4. Deploy your backend and frontend separately or as a single application

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - If you get an error that a port is already in use, you can change the port in:
     - Backend: In `app.py`, change the port in `uvicorn.run(app, host="0.0.0.0", port=8000)`
     - Frontend: In `package.json`, add `"start": "set PORT=3001 && react-scripts start"` (Windows) or `"start": "PORT=3001 react-scripts start"` (macOS/Linux)

2. **Face Recognition Not Working**:
   - Ensure your webcam is properly connected and permissions are granted
   - Check that the lighting conditions are adequate
   - Make sure you're facing the camera directly

3. **Mobile Responsiveness Issues**:
   - Ensure you're using a modern browser on your mobile device
   - Try clearing the browser cache
   - Check that your device's camera permissions are enabled

## Support

For support during exhibition setup, please contact the development team.
