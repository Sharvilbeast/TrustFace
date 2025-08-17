
# TrustFace 2.0 - Advanced Face Recognition for Competitive Exams

TrustFace 2.0 is a state-of-the-art face recognition system designed specifically for competitive exams. It provides secure biometric authentication, exam session management, and identity verification to ensure exam integrity.

## Features

- **Face Registration**: Users can register their face for biometric authentication
- **Face Login**: Secure login using face recognition instead of passwords
- **Exam Session Management**: Start, verify, and end exam sessions with face verification
- **Real-time Identity Verification**: Continuous monitoring during exams
- **Data Management**: Clear face data when needed
- **Futuristic UI**: Modern, intuitive user interface with a futuristic design

## System Requirements

- Python 3.8 or higher
- Node.js 14 or higher
- Webcam for face capture
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation

### Backend Setup

1. Navigate to the project directory:
   ```
   cd TrustFace-2.0
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scriptsctivate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the backend dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```
   cd backend
   python app.py
   ```

   The backend will be running at `http://localhost:8000`

### Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```
   cd TrustFace-2.0/frontend
   ```

2. Install the frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

   The frontend will be running at `http://localhost:3000`

## Usage

1. **Registration**: Create an account by providing your details and registering your face
2. **Login**: Use either your credentials or face recognition to log in
3. **Dashboard**: Access your dashboard to manage exams and face data
4. **Face Registration**: Register your face if you haven't already
5. **Start Exam**: Begin an exam session and verify your identity
6. **Exam Completion**: End the exam session when finished

## Face Recognition Accuracy

TrustFace 2.0 uses advanced face recognition algorithms to achieve high accuracy. The system:

- Uses deep learning-based face detection
- Employs robust feature extraction techniques
- Implements strict matching thresholds
- Provides real-time feedback during verification

For optimal results:
- Ensure good lighting conditions
- Position your face directly in front of the camera
- Remove glasses or face coverings if possible
- Keep a neutral expression during verification

## Security Features

- Secure token-based authentication
- Encrypted face data storage
- Session management with expiration
- Protection against spoofing attempts
- Data privacy controls

## API Documentation

The backend API provides the following endpoints:

- `POST /register` - User registration
- `POST /token` - User login
- `POST /upload-face` - Upload face data
- `POST /face-login` - Face recognition login
- `POST /start-exam-session` - Start an exam session
- `POST /verify-exam-session` - Verify identity during exam
- `POST /end-exam-session` - End an exam session
- `DELETE /clear-face-data` - Clear user's face data
- `GET /users/me` - Get current user information

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the project repository.
