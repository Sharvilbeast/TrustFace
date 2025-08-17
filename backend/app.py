
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status, Form, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
import cv2
import numpy as np
import face_recognition
from sqlalchemy import create_engine, Column, String, LargeBinary, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
import jwt
import secrets
from passlib.context import CryptContext
import json

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./trustface.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security setup
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Create directories if they don't exist
os.makedirs("backend/uploads", exist_ok=True)
os.makedirs("backend/known_faces", exist_ok=True)

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="student")  # student, admin, proctor
    face_registered = Column(Boolean, default=False)  # Track if face is registered
    created_at = Column(DateTime, default=datetime.utcnow)

class FaceData(Base):
    __tablename__ = "face_data"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    face_encoding = Column(LargeBinary)  # Stored as binary
    created_at = Column(DateTime, default=datetime.utcnow)

class ExamSession(Base):
    __tablename__ = "exam_sessions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True)
    exam_id = Column(String)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    is_active = Column(Boolean, default=True)
    verified = Column(Boolean, default=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserBase(BaseModel):
    username: str
    full_name: str
    role: str = "student"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    face_registered: bool
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    face_registered: bool = False

class TokenData(BaseModel):
    username: Optional[str] = None

class FaceLoginRequest(BaseModel):
    image_data: str  # base64 encoded image

class FaceLoginResponse(BaseModel):
    success: bool
    user_id: Optional[str] = None
    message: str
    username: Optional[str] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = None

# FastAPI app
app = FastAPI(title="TrustFace - Exam Face Recognition System")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Security functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# API Routes
@app.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )

    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role,
        face_registered=False  # Face not registered yet
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Allow login even if face is not registered
    # But include face registration status in the response
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "face_registered": user.face_registered}

@app.post("/upload-face")
async def upload_face(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save uploaded file
    file_location = f"backend/uploads/{current_user.id}_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Process the image to extract face encoding
    image = face_recognition.load_image_file(file_location)
    face_locations = face_recognition.face_locations(image)

    if not face_locations:
        raise HTTPException(status_code=400, detail="No face detected in the image")

    if len(face_locations) > 1:
        raise HTTPException(status_code=400, detail="Multiple faces detected. Please upload an image with only one face")

    face_encoding = face_recognition.face_encodings(image, face_locations)[0]

    # Check if user already has face data
    existing_face_data = db.query(FaceData).filter(FaceData.user_id == current_user.id).first()
    if existing_face_data:
        # Update existing face data
        existing_face_data.face_encoding = face_encoding.tobytes()
    else:
        # Save new face encoding to database
        face_data = FaceData(
            user_id=current_user.id,
            face_encoding=face_encoding.tobytes()
        )
        db.add(face_data)

    # Mark user as having face registered
    current_user.face_registered = True

    db.commit()

    # Save the face image for reference
    face_image_path = f"backend/known_faces/{current_user.id}.jpg"
    top, right, bottom, left = face_locations[0]
    face_image = image[top:bottom, left:right]
    face_image_rgb = cv2.cvtColor(face_image, cv2.COLOR_RGB2BGR)
    cv2.imwrite(face_image_path, face_image_rgb)

    return {"message": "Face data uploaded successfully", "face_registered": True}

@app.post("/face-login", response_model=FaceLoginResponse)
async def face_login(request: FaceLoginRequest, db: Session = Depends(get_db)):
    try:
        # Decode base64 image
        import base64
        header, encoded = request.image_data.split(",", 1)
        image_data = base64.b64decode(encoded)

        # Convert to numpy array
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to RGB for face_recognition
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Find faces in the image
        face_locations = face_recognition.face_locations(rgb_img)

        if not face_locations:
            return FaceLoginResponse(
                success=False,
                message="No face detected in the image"
            )

        if len(face_locations) > 1:
            return FaceLoginResponse(
                success=False,
                message="Multiple faces detected. Please ensure only one person is in the frame"
            )

        # Get face encoding
        face_encoding = face_recognition.face_encodings(rgb_img, face_locations)[0]

        # Get all face encodings from database
        all_face_data = db.query(FaceData).all()

        if not all_face_data:
            return FaceLoginResponse(
                success=False,
                message="No face data available in the system"
            )

        # Compare with known faces
        best_match_user_id = None
        best_match_distance = float('inf')

        for face_data in all_face_data:
            known_encoding = np.frombuffer(face_data.face_encoding, dtype=np.float64)
            distance = face_recognition.face_distance([known_encoding], face_encoding)[0]

            if distance < best_match_distance:
                best_match_distance = distance
                best_match_user_id = face_data.user_id

        # Check if match is good enough (threshold can be adjusted)
        if best_match_distance < 0.6:  # Lower is more strict
            user = db.query(User).filter(User.id == best_match_user_id).first()
            if user:
                # Create access token
                access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                access_token = create_access_token(
                    data={"sub": user.username}, expires_delta=access_token_expires
                )

                return FaceLoginResponse(
                    success=True,
                    user_id=user.id,
                    message="Face recognized successfully",
                    username=user.username,
                    access_token=access_token,
                    token_type="bearer"
                )

        return FaceLoginResponse(
            success=False,
            message="Face not recognized. Please try again or register your face."
        )

    except Exception as e:
        return FaceLoginResponse(
            success=False,
            message=f"Error processing face login: {str(e)}"
        )

@app.post("/start-exam-session")
async def start_exam_session(
    exam_id: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user has face data
    face_data = db.query(FaceData).filter(FaceData.user_id == current_user.id).first()
    if not face_data:
        raise HTTPException(
            status_code=400,
            detail="No face data found. Please register your face before starting an exam."
        )

    # Create exam session
    exam_session = ExamSession(
        user_id=current_user.id,
        exam_id=exam_id
    )
    db.add(exam_session)
    db.commit()
    db.refresh(exam_session)

    return {"message": "Exam session started successfully", "session_id": exam_session.id}

@app.post("/verify-exam-session")
async def verify_exam_session(
    session_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get exam session
    exam_session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if not exam_session:
        raise HTTPException(status_code=404, detail="Exam session not found")

    if exam_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to verify this session")

    # Save uploaded file
    file_location = f"backend/uploads/verify_{session_id}_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Process the image to extract face encoding
    image = face_recognition.load_image_file(file_location)
    face_locations = face_recognition.face_locations(image)

    if not face_locations:
        raise HTTPException(status_code=400, detail="No face detected in the image")

    if len(face_locations) > 1:
        raise HTTPException(status_code=400, detail="Multiple faces detected")

    face_encoding = face_recognition.face_encodings(image, face_locations)[0]

    # Get user's face encoding from database
    user_face_data = db.query(FaceData).filter(FaceData.user_id == current_user.id).first()
    if not user_face_data:
        raise HTTPException(status_code=400, detail="No face data found for this user")

    known_encoding = np.frombuffer(user_face_data.face_encoding, dtype=np.float64)
    distance = face_recognition.face_distance([known_encoding], face_encoding)[0]

    # Check if match is good enough
    if distance < 0.6:  # Lower is more strict
        exam_session.verified = True
        db.commit()
        return {"message": "Face verified successfully", "verified": True}
    else:
        return {"message": "Face verification failed", "verified": False}

@app.post("/end-exam-session")
async def end_exam_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get exam session
    exam_session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if not exam_session:
        raise HTTPException(status_code=404, detail="Exam session not found")

    if exam_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to end this session")

    exam_session.end_time = datetime.utcnow()
    exam_session.is_active = False
    db.commit()

    return {"message": "Exam session ended successfully"}

@app.get("/face-data")
async def get_face_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user's face data
    face_data = db.query(FaceData).filter(FaceData.user_id == current_user.id).all()
    
    # Return face registration status
    return [{"id": data.id, "user_id": data.user_id} for data in face_data]

@app.delete("/clear-face-data")
async def clear_face_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Delete user's face data
    face_data = db.query(FaceData).filter(FaceData.user_id == current_user.id).all()
    for data in face_data:
        db.delete(data)

    # Update user's face_registered flag
    current_user.face_registered = False

    # Delete face image file
    face_image_path = f"backend/known_faces/{current_user.id}.jpg"
    if os.path.exists(face_image_path):
        os.remove(face_image_path)

    db.commit()
    return {"message": "Face data cleared successfully", "face_registered": False}

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
