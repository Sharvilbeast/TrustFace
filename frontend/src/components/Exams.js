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

// Styled Components
const ExamsContainer = styled.div`
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

const BackButton = styled(ButtonOutline)`
  align-self: flex-start;
  width: auto;
  padding: 8px 12px;
  margin: 0;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Exams = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [faceRegistered, setFaceRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFaceRegistration();
  }, []);

  const checkFaceRegistration = async () => {
    try {
      setLoading(true);
      // Check if user has face_registered property
      if (auth.user.hasOwnProperty('face_registered')) {
        setFaceRegistered(auth.user.face_registered);
      } else {
        // Fallback to API call
        const response = await axios.get('/face-data');
        setFaceRegistered(response.data.length > 0);
      }
    } catch (err) {
      console.error('Error checking face registration:', err);
    } finally {
      setLoading(false);
    }
  };

  const startExam = (examId) => {
    // Redirect to face verification page first
    navigate(`/exam-verification/${examId}`);
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

  // Mock exam data - in a real app, this would come from an API
  const exams = [
    { 
      id: 'math101', 
      name: 'Mathematics 101', 
      duration: '120 mins', 
      status: 'available',
      description: 'Basic mathematics concepts including algebra, geometry, and trigonometry.',
      questions: 50,
      passingScore: '60%'
    },
    { 
      id: 'phys201', 
      name: 'Physics Advanced', 
      duration: '180 mins', 
      status: 'available',
      description: 'Advanced physics concepts including mechanics, thermodynamics, and electromagnetism.',
      questions: 75,
      passingScore: '70%'
    },
    { 
      id: 'chem301', 
      name: 'Chemistry Final', 
      duration: '150 mins', 
      status: 'upcoming',
      description: 'Comprehensive chemistry exam covering organic, inorganic, and physical chemistry.',
      questions: 60,
      passingScore: '65%'
    },
    { 
      id: 'bio101', 
      name: 'Biology Basics', 
      duration: '90 mins', 
      status: 'available',
      description: 'Introduction to biology covering cells, genetics, and ecosystems.',
      questions: 40,
      passingScore: '60%'
    },
    { 
      id: 'cs201', 
      name: 'Computer Science Fundamentals', 
      duration: '120 mins', 
      status: 'available',
      description: 'Core computer science concepts including algorithms, data structures, and programming basics.',
      questions: 60,
      passingScore: '70%'
    },
  ];

  return (
    <ExamsContainer>
      <Header>
        <Logo>TrustFace</Logo>
        <UserInfo>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserDetails>
            <UserName>{auth.user.full_name || auth.user.username}</UserName>
            <UserRole>{auth.user.role}</UserRole>
          </UserDetails>
          <ButtonOutline as={Link} to="/dashboard">
            Dashboard
          </ButtonOutline>
        </UserInfo>
      </Header>

      <MainContent>
        <div>
          <TopBar>
            <BackButton as={Link} to="/dashboard">← Back to Dashboard</BackButton>
            <PageTitle style={{ margin: 0 }}>Available Exams</PageTitle>
          </TopBar>
          <PageDescription>
            Browse and start your available exams. Face verification is required before starting any exam.
          </PageDescription>
        </div>

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
                {exam.description}
              </CardDescription>
              <div style={{ marginBottom: '15px', fontSize: '14px' }}>
                <div><strong>Duration:</strong> {exam.duration}</div>
                <div><strong>Questions:</strong> {exam.questions}</div>
                <div><strong>Passing Score:</strong> {exam.passingScore}</div>
                {exam.availableFrom && (
                  <div><strong>Available From:</strong> {exam.availableFrom}</div>
                )}
              </div>
              <Button 
                onClick={() => startExam(exam.id)}
                disabled={exam.status !== 'available' || !faceRegistered}
              >
                {exam.status === 'available' 
                  ? (faceRegistered ? 'Start Exam' : 'Register Face First') 
                  : 'Not Available Yet'}
              </Button>
            </Card>
          ))}
        </CardGrid>

        {!faceRegistered && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#f87171', marginBottom: '15px' }}>
              You need to register your face before you can start any exam.
            </p>
            <Button as={Link} to="/face-registration">
              Register Face Now
            </Button>
          </div>
        )}
      </MainContent>
    </ExamsContainer>
  );
};

export default Exams;