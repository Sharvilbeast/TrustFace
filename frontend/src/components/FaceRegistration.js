
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
const FaceRegistrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const FaceRegistrationCard = styled.div`
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

const Instructions = styled.div`
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

const InstructionList = styled.ul`
  padding-left: 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.6;
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

const FileUploadContainer = styled.div`
  margin: 20px 0;
`;

const FileUploadLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const FileUploadInput = styled.input`
  display: none;
`;

const FileUploadButton = styled(ButtonOutline)`
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: auto;
`;

const FileUploadPreview = styled.div`
  margin-top: 15px;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: ${props => props.theme.borderRadius};
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const FaceRegistration = () => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState({ message: '', success: false, error: false });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [useWebcam, setUseWebcam] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      return imageSrc;
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRegisterFace = async () => {
    setLoading(true);
    setStatus({ message: 'Processing...', success: false, error: false });

    try {
      let formData = new FormData();

      if (useWebcam) {
        // Capture from webcam
        const imageSrc = captureImage();
        if (!imageSrc) {
          throw new Error('Failed to capture image from webcam');
        }

        // Convert base64 to blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "face_capture.jpg", { type: "image/jpeg" });
        formData.append('file', file);
      } else {
        // Use uploaded file
        if (!selectedFile) {
          throw new Error('No file selected');
        }
        formData.append('file', selectedFile);
      }

      // Upload to backend
      const response = await axios.post('/upload-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({ 
        message: 'Face registered successfully! You can now use face recognition to login and verify your identity during exams.', 
        success: true, 
        error: false 
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Face registration failed';
      setStatus({ message: errorMessage, success: false, error: true });
      console.error('Face registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInputMethod = () => {
    setUseWebcam(!useWebcam);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <FaceRegistrationContainer>
      <FaceRegistrationCard>
        <Logo>TrustFace</Logo>
        <Tagline>Register Your Face for Biometric Authentication</Tagline>

        <Instructions>
          <InstructionTitle>Face Registration Instructions</InstructionTitle>
          <InstructionList>
            <li>Ensure your face is clearly visible and well-lit</li>
            <li>Position yourself facing the camera directly</li>
            <li>Remove glasses, hats or other face coverings if possible</li>
            <li>Keep a neutral expression with eyes open</li>
            <li>Ensure only your face is in the frame</li>
          </InstructionList>
        </Instructions>

        {useWebcam ? (
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
        ) : (
          <FileUploadContainer>
            <FileUploadLabel>Upload a clear photo of your face</FileUploadLabel>
            <FileUploadInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <FileUploadButton as="div" onClick={triggerFileInput}>
              Choose File
            </FileUploadButton>
            {previewUrl && (
              <FileUploadPreview>
                <img src={previewUrl} alt="Face preview" />
              </FileUploadPreview>
            )}
          </FileUploadContainer>
        )}

        <StatusMessage success={status.success} error={status.error}>
          {status.message || (useWebcam 
            ? 'Position your face in the frame and click register' 
            : 'Upload a clear photo of your face')}
        </StatusMessage>

        <Button onClick={handleRegisterFace} disabled={loading || (!useWebcam && !selectedFile)}>
          {loading ? 'Registering...' : 'Register Face'}
        </Button>

        <ButtonOutline onClick={toggleInputMethod}>
          {useWebcam ? 'Use Image Upload Instead' : 'Use Webcam Instead'}
        </ButtonOutline>

        <Divider>
          <span>OR</span>
        </Divider>

        <ButtonOutline as={Link} to="/dashboard">
          Back to Dashboard
        </ButtonOutline>
      </FaceRegistrationCard>
    </FaceRegistrationContainer>
  );
};

export default FaceRegistration;
