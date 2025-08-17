
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const CardTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 20px;
  font-size: 14px;
`;

const Button = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: 10px 16px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ButtonOutline = styled(Button)`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary};

  &:hover {
    background: rgba(74, 158, 255, 0.1);
  }
`;

const ButtonDanger = styled(Button)`
  background: linear-gradient(90deg, ${props => props.theme.colors.error}, #ff5252);

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(248, 113, 113, 0.3), 0 2px 4px -1px rgba(248, 113, 113, 0.2);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 10px;

  ${props => props.success && `
    background: rgba(74, 222, 128, 0.2);
    color: ${props.theme.colors.success};
  `}

  ${props => props.warning && `
    background: rgba(251, 191, 36, 0.2);
    color: ${props.theme.colors.warning};
  `}

  ${props => props.error && `
    background: rgba(248, 113, 113, 0.2);
    color: ${props.theme.colors.error};
  `}
`;

const LogoutButton = styled(ButtonOutline)`
  background: rgba(248, 113, 113, 0.1);
  border-color: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.error};

  &:hover {
    background: rgba(248, 113, 113, 0.2);
  }
`;

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [faceRegistered, setFaceRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFaceRegistration();
  }, []);

  const checkFaceRegistration = async () => {
    try {
      setLoading(true);
      console.log('Checking face registration status...');
      
      // First check if user object has face_registered property
      if (auth.user && auth.user.hasOwnProperty('face_registered')) {
        console.log('User object has face_registered property:', auth.user.face_registered);
        setFaceRegistered(auth.user.face_registered);
        return;
      }
      
      // If not, try to get it from the /users/me endpoint
      try {
        console.log('Getting user data from /users/me...');
        const userResponse = await axios.get('/users/me');
        console.log('User data response:', userResponse.data);
        
        if (userResponse.data && userResponse.data.hasOwnProperty('face_registered')) {
          console.log('Setting face registered from user data:', userResponse.data.face_registered);
          setFaceRegistered(userResponse.data.face_registered);
          return;
        }
      } catch (userErr) {
        console.error('Error getting user data:', userErr);
      }
      
      // As a last resort, check the face-data endpoint
      console.log('Checking face data from /face-data endpoint...');
      const response = await axios.get('/face-data');
      console.log('Face data response:', response.data);
      
      const hasFaceData = Array.isArray(response.data) && response.data.length > 0;
      console.log('Has face data:', hasFaceData);
      setFaceRegistered(hasFaceData);
    } catch (err) {
      console.error('Error checking face registration:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClearFaceData = async () => {
    if (window.confirm('Are you sure you want to clear your face data? This action cannot be undone.')) {
      try {
        setLoading(true);
        await axios.delete('/clear-face-data');
        setFaceRegistered(false);
        alert('Face data cleared successfully');
      } catch (err) {
        console.error('Error clearing face data:', err);
        alert('Failed to clear face data');
      } finally {
        setLoading(false);
      }
    }
  };

  const startExam = (examId) => {
    navigate(`/exam-session/${examId}`);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!auth.user.full_name) return auth.user.username.charAt(0).toUpperCase();
    return auth.user.full_name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  // Mock exam data
  const exams = [
    { id: 'math101', name: 'Mathematics 101', duration: '120 mins', status: 'available' },
    { id: 'phys201', name: 'Physics Advanced', duration: '180 mins', status: 'available' },
    { id: 'chem301', name: 'Chemistry Final', duration: '150 mins', status: 'upcoming' },
  ];

  return (
    <DashboardContainer>
      <Header>
        <Logo>TrustFace</Logo>
        <UserInfo>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserDetails>
            <UserName>{auth.user.full_name || auth.user.username}</UserName>
            <UserRole>{auth.user.role}</UserRole>
          </UserDetails>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <div>
          <PageTitle>Welcome, {auth.user.full_name || auth.user.username}</PageTitle>
          <PageDescription>
            Manage your exams and face recognition settings from your dashboard
          </PageDescription>
        </div>

        <CardGrid>
          <Card>
            <CardTitle>
              <CardIcon>👤</CardIcon>
              Face Registration
              <StatusBadge success={faceRegistered} warning={!faceRegistered}>
                {faceRegistered ? 'Registered' : 'Not Registered'}
              </StatusBadge>
            </CardTitle>
            <CardDescription>
              {faceRegistered 
                ? 'Your face is registered for biometric authentication.' 
                : 'Register your face to enable biometric login and exam verification.'}
            </CardDescription>
            {faceRegistered ? (
              <ButtonDanger onClick={handleClearFaceData} disabled={loading}>
                Clear Face Data
              </ButtonDanger>
            ) : (
              <Button as={Link} to="/face-registration">
                Register Face
              </Button>
            )}
          </Card>

          <Card>
            <CardTitle>
              <CardIcon>🔐</CardIcon>
              Face Login
            </CardTitle>
            <CardDescription>
              Use your face to securely login to your account without a password.
            </CardDescription>
            <Button as={Link} to="/face-login">
              Login with Face
            </Button>
          </Card>

          <Card>
            <CardTitle>
              <CardIcon>📝</CardIcon>
              Available Exams
            </CardTitle>
            <CardDescription>
              View and start your available exams. Face verification is required before starting.
            </CardDescription>
            <Button as={Link} to="/exams">
              View Exams
            </Button>
          </Card>
        </CardGrid>

        <div>
          <PageTitle>Upcoming Exams</PageTitle>
          <CardGrid>
            {exams.map((exam) => (
              <Card key={exam.id}>
                <CardTitle>
                  <CardIcon>📋</CardIcon>
                  {exam.name}
                  <StatusBadge 
                    success={exam.status === 'available'} 
                    warning={exam.status === 'upcoming'}
                  >
                    {exam.status === 'available' ? 'Available' : 'Upcoming'}
                  </StatusBadge>
                </CardTitle>
                <CardDescription>
                  Duration: {exam.duration}
                </CardDescription>
                <Button 
                  onClick={() => startExam(exam.id)}
                  disabled={exam.status !== 'available' || !faceRegistered}
                >
                  {exam.status === 'available' 
                    ? (faceRegistered ? 'Start Exam' : 'Register Face First') 
                    : 'Not Available'}
                </Button>
              </Card>
            ))}
          </CardGrid>
        </div>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
