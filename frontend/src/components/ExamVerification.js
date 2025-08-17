import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
    box-shadow: 0 0 0 0 rgba(74, 158, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(74, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 158, 255, 0);
  }
`;

// Styled Components
const VerificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const VerificationCard = styled.div`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 30px;
  width: 100%;
  max-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 30px;
  text-align: center;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
`;

const Video = styled.video`
  width: 100%;
  border-radius: ${props => props.theme.borderRadius};
  transform: ${props => props.mirrored ? 'scaleX(-1)' : 'none'};
`;

const Canvas = styled.canvas`
  display: none;
`;

const CaptureFrame = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
  pointer-events: none;
`;

const Button = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: 12px 20px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  width: 100%;
  margin-bottom: 15px;

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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background: rgba(248, 113, 113, 0.1);
  border-radius: ${props => props.theme.borderRadius};
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  background: rgba(74, 222, 128, 0.1);
  border-radius: ${props => props.theme.borderRadius};
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: ${props => props.theme.borderRadius};
`;

const Spinner = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.primary};
  animation: ${Spinner} 1s linear infinite;
  margin-bottom: 10px;
`;

const ExamInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borderRadius};
  padding: 15px;
  margin-bottom: 20px;
`;

const ExamInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ExamInfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const ExamInfoValue = styled.span`
  font-weight: 600;
`;

const ExamVerification = () => {
  const { examId } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [examData, setExamData] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Mock exam data - in a real app, this would come from an API
  const exams = {
    'math101': { 
      name: 'Mathematics 101', 
      duration: '120 mins', 
      questions: 50,
      passingScore: '60%',
      description: 'Basic mathematics concepts including algebra, geometry, and trigonometry.'
    },
    'phys201': { 
      name: 'Physics Advanced', 
      duration: '180 mins', 
      questions: 75,
      passingScore: '70%',
      description: 'Advanced physics concepts including mechanics, thermodynamics, and electromagnetism.'
    },
    'bio101': { 
      name: 'Biology Basics', 
      duration: '90 mins', 
      questions: 40,
      passingScore: '60%',
      description: 'Introduction to biology covering cells, genetics, and ecosystems.'
    },
    'cs201': { 
      name: 'Computer Science Fundamentals', 
      duration: '120 mins', 
      questions: 60,
      passingScore: '70%',
      description: 'Core computer science concepts including algorithms, data structures, and programming basics.'
    }
  };

  useEffect(() => {
    // Get exam data
    if (examId && exams[examId]) {
      setExamData(exams[examId]);
    } else {
      setError('Invalid exam ID');
    }

    // Start camera
    startCamera();

    // Create exam session
    createExamSession();

    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [examId]);

  const startCamera = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure camera permissions are granted and try again.');
    } finally {
      setLoading(false);
    }
  };

  const createExamSession = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/start-exam-session', { exam_id: examId });
      console.log('Exam session created:', response.data);
      setSessionId(response.data.session_id);
    } catch (err) {
      console.error('Error creating exam session:', err);
      setError('Could not create exam session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const captureAndVerify = async () => {
    if (!cameraActive || !sessionId) {
      setError('Camera not active or session not created. Please refresh and try again.');
      return;
    }

    try {
      setVerifying(true);
      setError('');
      setSuccess('');

      // Capture image from video
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas (flipped horizontally)
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      
      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'verification.jpg');
      formData.append('session_id', sessionId);
      
      // Send to server for verification
      const response = await axios.post('/verify-exam-session', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Verification response:', response.data);
      
      if (response.data.verified) {
        setSuccess('Face verified successfully! Redirecting to exam...');
        
        // Redirect to exam after a short delay
        setTimeout(() => {
          navigate(`/exam-session/${examId}`);
        }, 2000);
      } else {
        setError('Face verification failed. Please try again or ensure proper lighting and positioning.');
      }
    } catch (err) {
      console.error('Error verifying face:', err);
      setError('Error during verification. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <VerificationContainer>
      <VerificationCard>
        <Title>Face Verification Required</Title>
        <Subtitle>
          Please verify your identity before starting the exam
        </Subtitle>

        {examData && (
          <ExamInfo>
            <ExamInfoItem>
              <ExamInfoLabel>Exam:</ExamInfoLabel>
              <ExamInfoValue>{examData.name}</ExamInfoValue>
            </ExamInfoItem>
            <ExamInfoItem>
              <ExamInfoLabel>Duration:</ExamInfoLabel>
              <ExamInfoValue>{examData.duration}</ExamInfoValue>
            </ExamInfoItem>
            <ExamInfoItem>
              <ExamInfoLabel>Questions:</ExamInfoLabel>
              <ExamInfoValue>{examData.questions}</ExamInfoValue>
            </ExamInfoItem>
            <ExamInfoItem>
              <ExamInfoLabel>Passing Score:</ExamInfoLabel>
              <ExamInfoValue>{examData.passingScore}</ExamInfoValue>
            </ExamInfoItem>
          </ExamInfo>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <VideoContainer>
          <Video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            mirrored={true}
          />
          <Canvas ref={canvasRef} />
          <CaptureFrame />
          
          {(loading || verifying) && (
            <LoadingOverlay>
              <LoadingSpinner />
              <div>{verifying ? 'Verifying your face...' : 'Starting camera...'}</div>
            </LoadingOverlay>
          )}
        </VideoContainer>

        <Button 
          onClick={captureAndVerify}
          disabled={!cameraActive || loading || verifying || !sessionId}
        >
          {verifying ? 'Verifying...' : 'Verify Face & Start Exam'}
        </Button>
        
        <ButtonOutline as={Link} to="/exams">
          Cancel
        </ButtonOutline>
      </VerificationCard>
    </VerificationContainer>
  );
};

export default ExamVerification;