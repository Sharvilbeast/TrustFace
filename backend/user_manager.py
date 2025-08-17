
import os
import sys
import getpass
from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import Base, User, FaceData, ExamSession, get_password_hash

def list_users(db):
    """List all users in the database"""
    users = db.query(User).all()

    if not users:
        print("No users found in the database.")
        return

    print("\nUsers in the database:")
    print("-" * 80)
    print(f"{'ID':<8} {'Username':<20} {'Email':<30} {'Full Name':<20} {'Role'}")
    print("-" * 80)

    for user in users:
        print(f"{user.id[:8]:<8} {user.username:<20} {user.email:<30} {user.full_name:<20} {user.role}")

    print("-" * 80)
    print(f"Total users: {len(users)}")

def delete_user(db, user_id=None, username=None, email=None):
    """Delete a user from the database"""
    if not any([user_id, username, email]):
        print("Please provide either user_id, username, or email to delete a user.")
        return False

    # Build the query
    query = db.query(User)
    if user_id:
        query = query.filter(User.id == user_id)
    elif username:
        query = query.filter(User.username == username)
    elif email:
        query = query.filter(User.email == email)

    user = query.first()

    if not user:
        print("User not found.")
        return False

    print(f"Found user: {user.username} ({user.email})")

    # Delete associated face data
    face_data = db.query(FaceData).filter(FaceData.user_id == user.id).all()
    if face_data:
        print(f"Deleting {len(face_data)} face data records...")
        for data in face_data:
            db.delete(data)

    # Delete associated exam sessions
    exam_sessions = db.query(ExamSession).filter(ExamSession.user_id == user.id).all()
    if exam_sessions:
        print(f"Deleting {len(exam_sessions)} exam session records...")
        for session in exam_sessions:
            db.delete(session)

    # Delete face image file if it exists
    face_image_path = f"known_faces/{user.id}.jpg"
    if os.path.exists(face_image_path):
        print(f"Deleting face image file: {face_image_path}")
        os.remove(face_image_path)

    # Delete the user
    db.delete(user)
    db.commit()

    print(f"User {user.username} has been deleted successfully.")
    return True

def create_user(db):
    """Create a new user in the database"""
    print("\nCreate a new user:")
    print("-" * 30)

    username = input("Username: ")
    email = input("Email: ")
    full_name = input("Full Name: ")

    # Check if user already exists
    existing_user = db.query(User).filter(
        or_(User.username == username, User.email == email)
    ).first()

    if existing_user:
        print(f"Error: User with username '{username}' or email '{email}' already exists.")
        return False

    # Get password
    password = getpass.getpass("Password: ")
    confirm_password = getpass.getpass("Confirm Password: ")

    if password != confirm_password:
        print("Error: Passwords do not match.")
        return False

    # Get role
    print("\nAvailable roles:")
    print("1. student")
    print("2. admin")
    print("3. proctor")

    role_choice = input("Select role (1-3): ")
    role_map = {"1": "student", "2": "admin", "3": "proctor"}
    role = role_map.get(role_choice, "student")

    # Create the user
    hashed_password = get_password_hash(password)
    new_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        full_name=full_name,
        role=role
    )

    db.add(new_user)
    db.commit()

    print(f"\nUser '{username}' has been created successfully with role '{role}'.")
    return True

def main():
    print("TrustFace 2.0 User Manager")
    print("=" * 30)

    # Database setup
    SQLALCHEMY_DATABASE_URL = "sqlite:///./trustface.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create a session
    db = SessionLocal()

    try:
        while True:
            print("\nOptions:")
            print("1. List all users")
            print("2. Delete a user")
            print("3. Create a new user")
            print("4. Exit")

            choice = input("\nEnter your choice (1-4): ")

            if choice == "1":
                list_users(db)
            elif choice == "2":
                print("\nDelete a user:")
                print("1. By ID")
                print("2. By username")
                print("3. By email")
                print("4. Cancel")

                delete_choice = input("Select option (1-4): ")

                if delete_choice == "1":
                    user_id = input("Enter user ID: ")
                    delete_user(db, user_id=user_id)
                elif delete_choice == "2":
                    username = input("Enter username: ")
                    delete_user(db, username=username)
                elif delete_choice == "3":
                    email = input("Enter email: ")
                    delete_user(db, email=email)
                elif delete_choice == "4":
                    print("Operation cancelled.")
                else:
                    print("Invalid option.")

            elif choice == "3":
                create_user(db)
            elif choice == "4":
                print("Exiting...")
                break
            else:
                print("Invalid option. Please try again.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
