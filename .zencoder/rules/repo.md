---
description: Repository Information Overview
alwaysApply: true
---

# TrustFace 2.0 Information

## Summary

TrustFace 2.0 is a state-of-the-art face recognition system designed specifically for competitive exams. It provides secure biometric authentication, exam session management, and identity verification to ensure exam integrity.

## Structure

- **backend/**: FastAPI backend server with face recognition capabilities
- **frontend/**: React-based frontend application
- **venv/**: Python virtual environment
- **.zencoder/**: Configuration directory
- **Installation scripts**: Various batch files for setup and installation

## Language & Runtime

**Language**: Python 3.8+ (Backend), JavaScript/React (Frontend)
**Version**: Python 3.13 (based on venv), Node.js 14+
**Build System**: pip (Backend), npm (Frontend)
**Package Manager**: pip (Backend), npm (Frontend)

## Dependencies

**Backend Dependencies**:

- fastapi: Web framework for building APIs
- uvicorn: ASGI server for FastAPI
- face-recognition: Face recognition library
- opencv-python: Computer vision library
- numpy: Numerical computing library
- SQLAlchemy: ORM for database operations
- python-jose: JWT token handling
- passlib: Password hashing

**Frontend Dependencies**:

- react: UI library
- react-dom: DOM manipulation for React
- react-router-dom: Routing for React
- axios: HTTP client
- react-webcam: Webcam integration
- styled-components: CSS-in-JS styling

## Build & Installation

```bash
# Backend setup
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
```

## Usage & Operations

```bash
# Start backend
cd backend
python app.py

# Start frontend
cd frontend
npm start
```

## Main Files & Resources

**Backend**:

- app.py: Main FastAPI application entry point
- backend/known_faces/: Directory for storing face data
- backend/uploads/: Directory for temporary file uploads
- trustface.db: SQLite database file

**Frontend**:

- src/App.js: Main React application component
- src/components/: React components
- src/context/: React context providers
- public/index.html: HTML template

## Testing

No specific testing framework was identified in the project.

## Issues Fixed

- Fixed incorrect numpy version in requirements.txt (changed from 2.1.0 to >=1.21.0)
- Fixed incorrect virtual environment activation path in batch files and documentation
- Created fixed versions of installation and startup scripts
