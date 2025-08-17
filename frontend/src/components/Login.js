
import React, { useState, useContext } from 'react';
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
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const LoginCard = styled.div`
  background: rgba(21, 25, 53, 0.7);
  backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 40px;
  width: 100%;
  max-width: 400px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Input = styled.input`
  background: rgba(30, 35, 65, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius};
  padding: 12px 16px;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  transition: ${props => props.theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.2);
  }
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

const ErrorMessage = styled.div`
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: ${props => props.theme.borderRadius};
  padding: 12px;
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-bottom: 20px;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Attempting login with:', { username, password });

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      console.log('Sending login request...');
      const response = await axios.post('/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Login response:', response.data);
      const { access_token, token_type, face_registered } = response.data;

      // Set the authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      console.log('Getting user info...');
      // Get user info
      const userResponse = await axios.get('/users/me');
      console.log('User info response:', userResponse.data);
      const user = userResponse.data;
      
      // Add face_registered to user object
      user.face_registered = face_registered;

      console.log('Logging in with user:', user);
      login(access_token, user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error details:', err.response?.data);
      setError('Invalid username or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>TrustFace</Logo>
        <Tagline>Advanced Face Recognition for Competitive Exams</Tagline>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <Divider>
          <span>OR</span>
        </Divider>

        <ButtonOutline as={Link} to="/face-login">
          Login with Face Recognition
        </ButtonOutline>

        <Divider>
          <span>NEW TO TRUSTFACE?</span>
        </Divider>

        <ButtonOutline as={Link} to="/register">
          Create an Account
        </ButtonOutline>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
