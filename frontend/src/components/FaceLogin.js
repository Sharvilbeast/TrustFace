
import React, { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
const FaceLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const FaceLoginCard = styled.div`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 40px;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${props => props.theme.shadows.neon};
`;

const Tagline = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 30px;
  font-size: 14px;
`;

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
  margin-bottom: 30px;
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
  margin-top: 10px;
  width: 100%;

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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    padding: 0 10px;
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FaceLogin = () => {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState({ message: '', success: false, error: false });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    }
    return null;
  };

  const handleFaceLogin = async () => {
    setLoading(true);
    setScanning(true);
    setStatus({ message: 'Scanning face...', success: false, error: false });

    try {
      // Capture image
      const imageSrc = captureImage();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      console.log('Sending face login request...');
      
      // Send to backend for face recognition
      const response = await axios.post('/face-login', {
        image_data: imageSrc,
      });

      console.log('Face login response:', response.data);
      const { success, user_id, username, access_token, token_type, message } = response.data;

      if (success && access_token) {
        // Set the authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        console.log('Getting user info...');
        // Get user info
        const userResponse = await axios.get('/users/me');
        console.log('User info response:', userResponse.data);
        const user = userResponse.data;
        
        // Make sure face_registered is set
        user.face_registered = true;

        console.log('Logging in with user:', user);
        login(access_token, user);
        setStatus({ message: 'Face recognized! Redirecting...', success: true, error: false });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setStatus({ message: message || 'Face not recognized. Please try again.', success: false, error: true });
      }
    } catch (err) {
      console.error('Face login error details:', err.response?.data);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Face recognition failed. Please try again.';
      setStatus({ message: errorMessage, success: false, error: true });
      console.error('Face login error:', err);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  return (
    <FaceLoginContainer>
      <FaceLoginCard>
        <Logo>TrustFace</Logo>
        <Tagline>Advanced Face Recognition for Competitive Exams</Tagline>

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
          {status.message || 'Position your face in the frame and click scan'}
        </StatusMessage>

        <Button onClick={handleFaceLogin} disabled={loading}>
          {loading ? 'Scanning...' : 'Scan Face'}
        </Button>

        <Divider>
          <span>OR</span>
        </Divider>

        <ButtonOutline as={Link} to="/login">
          Login with Username and Password
        </ButtonOutline>

        <Divider>
          <span>NEW TO TRUSTFACE?</span>
        </Divider>

        <ButtonOutline as={Link} to="/register">
          Create an Account
        </ButtonOutline>
      </FaceLoginCard>
    </FaceLoginContainer>
  );
};

export default FaceLogin;
