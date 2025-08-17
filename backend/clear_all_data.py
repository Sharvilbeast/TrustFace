
import os
import sys
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import Base, User, FaceData, ExamSession

def clear_all_data():
    """Clear all data from the database and remove all uploaded files"""
    print("Clearing all data from TrustFace 2.0 database...")

    # Database setup (same as in app.py)
    SQLALCHEMY_DATABASE_URL = "sqlite:///./trustface.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create a session
    db = SessionLocal()

    try:
        # Delete all records from each table
        print("Deleting all user records...")
        db.query(User).delete()

        print("Deleting all face data records...")
        db.query(FaceData).delete()

        print("Deleting all exam session records...")
        db.query(ExamSession).delete()

        # Commit the changes
        db.commit()
        print("All database records have been deleted.")

    except Exception as e:
        print(f"Error clearing database: {e}")
        db.rollback()
    finally:
        db.close()

    # Remove uploaded files
    uploads_dir = "backend/uploads"
    if os.path.exists(uploads_dir):
        print(f"Removing {uploads_dir} directory...")
        for file in os.listdir(uploads_dir):
            file_path = os.path.join(uploads_dir, file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")
        print(f"Cleared {uploads_dir} directory.")
    else:
        os.makedirs(uploads_dir, exist_ok=True)
        print(f"Created {uploads_dir} directory.")

    # Remove known faces
    known_faces_dir = "backend/known_faces"
    if os.path.exists(known_faces_dir):
        print(f"Removing {known_faces_dir} directory...")
        for file in os.listdir(known_faces_dir):
            file_path = os.path.join(known_faces_dir, file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")
        print(f"Cleared {known_faces_dir} directory.")
    else:
        os.makedirs(known_faces_dir, exist_ok=True)
        print(f"Created {known_faces_dir} directory.")

    print("All data has been cleared successfully!")
    print("The application will start with a completely clean database.")

if __name__ == "__main__":
    clear_all_data()
