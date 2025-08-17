
import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Webcam from 'react-webcam';
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
    box-shadow: 0 0 0 0 rgba(74, 158, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(74, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 158, 255, 0);
  }
`;

const scanning = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`;

// Styled Components
const ExamSessionContainer = styled.div`
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

const MainContent = styled.main`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const ExamCard = styled.div`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 30px;
  width: 100%;
  max-width: 800px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ExamTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
  text-align: center;
`;

const ExamInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ExamDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExamDetailLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 5px;
`;

const ExamDetailValue = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const VerificationSection = styled.div`
  margin: 30px 0;
`;

const VerificationTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 30px;
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  background: ${props => props.theme.colors.surfaceLight};
`;

const Camera = styled(Webcam)`
  width: 100%;
  height: auto;
  display: block;
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 14, 39, 0.2) 0%,
    rgba(10, 14, 39, 0.2) 45%,
    rgba(74, 158, 255, 0.3) 50%,
    rgba(10, 14, 39, 0.2) 55%,
    rgba(10, 14, 39, 0.2) 100%
  );
  animation: ${scanning} 2s linear infinite;
  pointer-events: none;
  opacity: ${props => props.scanning ? 1 : 0};
`;

const StatusMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  color: ${props => {
    if (props.success) return props.theme.colors.success;
    if (props.error) return props.theme.colors.error;
    return props.theme.colors.textSecondary;
  }};
`;

const Button = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: 14px 20px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  margin: 10px;
  width: calc(50% - 20px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    animation: ${pulse} 2s infinite;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const ExamInstructions = styled.div`
  background: rgba(30, 35, 65, 0.5);
  border-radius: ${props => props.theme.borderRadius};
  padding: 15px;
  margin-bottom: 20px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const InstructionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary};
`;

const InstructionList = styled.ol`
  padding-left: 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.6;

  li {
    margin-bottom: 8px;
  }
`;

const Timer = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin: 20px 0;
`;

const ExamSession = () => {
  const webcamRef = useRef(null);
  const { examId } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState({ message: '', success: false, error: false });
  const [loading, setLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionVerified, setSessionVerified] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Mock exam data
  const examData = {
    math101: {
      id: 'math101',
      name: 'Mathematics 101',
      duration: '120 mins',
      questions: 50,
      instructions: [
        'Read all questions carefully before answering',
        'You have 120 minutes to complete the exam',
        'No calculators or external aids are permitted',
        'Ensure your face is visible at all times during the exam',
        'Any suspicious activity will be flagged and reviewed'
      ]
    },
    phys201: {
      id: 'phys201',
      name: 'Physics Advanced',
      duration: '180 mins',
      questions: 75,
      instructions: [
        'Read all questions carefully before answering',
        'You have 180 minutes to complete the exam',
        'Scientific calculators are permitted',
        'Ensure your face is visible at all times during the exam',
        'Any suspicious activity will be flagged and reviewed'
      ]
    },
    chem301: {
      id: 'chem301',
      name: 'Chemistry Final',
      duration: '150 mins',
      questions: 60,
      instructions: [
        'Read all questions carefully before answering',
        'You have 150 minutes to complete the exam',
        'Periodic table will be provided',
        'Ensure your face is visible at all times during the exam',
        'Any suspicious activity will be flagged and reviewed'
      ]
    }
  };

  const exam = examData[examId] || examData.math101;

  // Timer effect
  useEffect(() => {
    let interval;

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Time's up
      handleEndExam();
    }

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Format time for display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    }
    return null;
  };

  const handleStartExam = async () => {
    setLoading(true);
    setStatus({ message: 'Starting exam session...', success: false, error: false });

    try {
      const response = await axios.post('/start-exam-session', {
        exam_id: exam.id
      });

      setSessionId(response.data.session_id);
      setSessionStarted(true);
      setStatus({ 
        message: 'Exam session started. Please verify your identity to begin.', 
        success: true, 
        error: false 
      });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to start exam session';
      setStatus({ message: errorMessage, success: false, error: true });
      console.error('Start exam error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (!sessionId) {
      setStatus({ message: 'Please start the exam session first', success: false, error: true });
      return;
    }

    setLoading(true);
    setScanning(true);
    setStatus({ message: 'Verifying identity...', success: false, error: false });

    try {
      // Capture image
      const imageSrc = captureImage();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      // Convert base64 to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "verification.jpg", { type: "image/jpeg" });

      // Create form data
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('file', file);

      // Send to backend for verification
      const verifyResponse = await axios.post('/verify-exam-session', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { verified, message } = verifyResponse.data;

      if (verified) {
        setSessionVerified(true);
        setTimerActive(true);
        setStatus({ 
          message: 'Identity verified successfully. Exam started. Good luck!', 
          success: true, 
          error: false 
        });
      } else {
        setStatus({ message, success: false, error: true });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Face verification failed';
      setStatus({ message: errorMessage, success: false, error: true });
      console.error('Face verification error:', err);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  const handleEndExam = async () => {
    if (!sessionId) return;

    setLoading(true);
    setStatus({ message: 'Ending exam session...', success: false, error: false });

    try {
      await axios.post('/end-exam-session', {
        session_id: sessionId
      });

      setTimerActive(false);
      setStatus({ 
        message: 'Exam session ended successfully. Thank you for participating.', 
        success: true, 
        error: false 
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to end exam session';
      setStatus({ message: errorMessage, success: false, error: true });
      console.error('End exam error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExamSessionContainer>
      <Header>
        <Logo>TrustFace</Logo>
        <div>
          <ButtonOutline as={Link} to="/dashboard">
            Back to Dashboard
          </ButtonOutline>
        </div>
      </Header>

      <MainContent>
        <ExamCard>
          <ExamTitle>{exam.name}</ExamTitle>

          <ExamInfo>
            <ExamDetail>
              <ExamDetailLabel>Duration</ExamDetailLabel>
              <ExamDetailValue>{exam.duration}</ExamDetailValue>
            </ExamDetail>
            <ExamDetail>
              <ExamDetailLabel>Questions</ExamDetailLabel>
              <ExamDetailValue>{exam.questions}</ExamDetailValue>
            </ExamDetail>
            <ExamDetail>
              <ExamDetailLabel>Status</ExamDetailLabel>
              <ExamDetailValue>
                {sessionVerified ? 'In Progress' : sessionStarted ? 'Awaiting Verification' : 'Not Started'}
              </ExamDetailValue>
            </ExamDetail>
          </ExamInfo>

          {sessionVerified && (
            <Timer>
              Time Remaining: {formatTime(timeRemaining)}
            </Timer>
          )}

          <ExamInstructions>
            <InstructionTitle>Exam Instructions</InstructionTitle>
            <InstructionList>
              {exam.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </InstructionList>
          </ExamInstructions>

          <VerificationSection>
            <VerificationTitle>
              {sessionVerified 
                ? 'Identity Verified - Exam in Progress' 
                : sessionStarted 
                  ? 'Verify Your Identity to Begin the Exam' 
                  : 'Start Your Exam Session'}
            </VerificationTitle>

            {!sessionStarted ? (
              <ButtonContainer>
                <Button onClick={handleStartExam} disabled={loading}>
                  {loading ? 'Starting...' : 'Start Exam Session'}
                </Button>
                <ButtonOutline as={Link} to="/dashboard">
                  Cancel
                </ButtonOutline>
              </ButtonContainer>
            ) : !sessionVerified ? (
              <>
                <CameraContainer>
                  <Camera
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: 'user',
                      width: { ideal: 640 },
                      height: { ideal: 480 }
                    }}
                  />
                  <ScannerOverlay scanning={scanning} />
                </CameraContainer>

                <StatusMessage success={status.success} error={status.error}>
                  {status.message || 'Position your face in the frame and click verify'}
                </StatusMessage>

                <ButtonContainer>
                  <Button onClick={handleVerifyIdentity} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Identity'}
                  </Button>
                  <ButtonDanger onClick={() => navigate('/dashboard')}>
                    Cancel Exam
                  </ButtonDanger>
                </ButtonContainer>
              </>
            ) : (
              <>
                <StatusMessage success={true}>
                  Your identity has been verified. The exam is now in progress.
                  Please keep your face visible to the camera throughout the exam.
                </StatusMessage>

                <div style={{ textAlign: 'center', margin: '30px 0', padding: '20px', background: 'rgba(30, 35, 65, 0.5)', borderRadius: '12px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#4a9eff' }}>Exam Content Would Appear Here</h3>
                  <p style={{ color: '#a0aec0' }}>
                    In a real implementation, this section would contain the actual exam questions.
                    For this demo, we're focusing on the face recognition verification system.
                  </p>
                </div>

                <ButtonContainer>
                  <ButtonDanger onClick={handleEndExam} disabled={loading}>
                    {loading ? 'Ending Exam...' : 'End Exam'}
                  </ButtonDanger>
                </ButtonContainer>
              </>
            )}
          </VerificationSection>
        </ExamCard>
      </MainContent>
    </ExamSessionContainer>
  );
};

export default ExamSession;
