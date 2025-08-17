#!/bin/bash

echo "TrustFace 2.0 Setup"
echo "=================="
echo ""
echo "This script will set up the entire TrustFace 2.0 project in a virtual environment."
echo "It may take several minutes to complete, especially when installing dlib."
echo ""

read -p "Press Enter to continue..."

echo "Running setup script..."
python3 setup.py

echo ""
echo "Setup completed!"
echo ""
echo "To run the application:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run the start script: ./start.sh"
echo ""

read -p "Press Enter to exit..."
