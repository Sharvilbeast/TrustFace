
import os
import sys
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import Base, User, FaceData, ExamSession

def reset_database():
    """Reset the database by removing all data but preserving the table structure"""
    print("Resetting TrustFace 2.0 database...")

    # Database setup (same as in app.py)
    SQLALCHEMY_DATABASE_URL = "sqlite:///./trustface.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create a session
    db = SessionLocal()

    try:
        # Delete all records from each table
        print("Deleting user records...")
        db.query(User).delete()

        print("Deleting face data records...")
        db.query(FaceData).delete()

        print("Deleting exam session records...")
        db.query(ExamSession).delete()

        # Commit the changes
        db.commit()
        print("All database records have been deleted.")

    except Exception as e:
        print(f"Error resetting database: {e}")
        db.rollback()
    finally:
        db.close()

    # Remove uploaded files
    uploads_dir = "uploads"
    if os.path.exists(uploads_dir):
        print(f"Removing {uploads_dir} directory...")
        shutil.rmtree(uploads_dir)
        os.makedirs(uploads_dir)
        print(f"Recreated {uploads_dir} directory.")

    # Remove known faces
    known_faces_dir = "known_faces"
    if os.path.exists(known_faces_dir):
        print(f"Removing {known_faces_dir} directory...")
        shutil.rmtree(known_faces_dir)
        os.makedirs(known_faces_dir)
        print(f"Recreated {known_faces_dir} directory.")

    print("Database reset completed successfully!")
    print("The application will start with a clean database.")

if __name__ == "__main__":
    reset_database()
