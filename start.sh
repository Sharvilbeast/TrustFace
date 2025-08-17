#!/bin/bash

echo "Starting TrustFace 2.0..."

# Start backend server
echo "Starting backend server..."
cd backend
gnome-terminal --tab --title="Backend Server" -- bash -c "python app.py; exec bash"

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
gnome-terminal --tab --title="Frontend Server" -- bash -c "npm start; exec bash"

echo "TrustFace 2.0 is starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press any key to exit this window..."
read -n 1 -s
