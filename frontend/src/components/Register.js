
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
const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const RegisterCard = styled.div`
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

const Select = styled.select`
  background: rgba(30, 35, 65, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius};
  padding: 12px 16px;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  transition: ${props => props.theme.transitions.normal};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.2);
  }

  option {
    background: ${props => props.theme.colors.surfaceLight};
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

const SuccessMessage = styled.div`
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: ${props => props.theme.borderRadius};
  padding: 12px;
  color: ${props => props.theme.colors.success};
  font-size: 14px;
  margin-bottom: 20px;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    console.log('Submitting registration with data:', {
      username: formData.username,
      email: formData.email,
      password: formData.password.length + ' characters',
      full_name: formData.full_name,
      role: formData.role
    });

    try {
      console.log('Sending registration request...');
      const response = await axios.post('/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role
      });

      console.log('Registration response:', response.data);
      setSuccess('Registration successful! Logging you in automatically...');

      // Auto login after successful registration
      setTimeout(async () => {
        try {
          const loginFormData = new FormData();
          loginFormData.append('username', formData.username);
          loginFormData.append('password', formData.password);

          const loginResponse = await axios.post('/token', loginFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const { access_token, face_registered } = loginResponse.data;

          // Get user info
          const userResponse = await axios.get('/users/me');
          const user = userResponse.data;
          
          // Add face_registered to user object
          user.face_registered = face_registered;

          login(access_token, user);
          navigate('/dashboard');
        } catch (err) {
          setError('Registration successful, but login failed. Please login manually.');
          console.error('Auto login error:', err);
        }
      }, 1500);
    } catch (err) {
      console.error('Registration error details:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>TrustFace</Logo>
        <Tagline>Advanced Face Recognition for Competitive Exams</Tagline>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="proctor">Proctor</option>
              <option value="admin">Admin</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>

        <Divider>
          <span>ALREADY HAVE AN ACCOUNT?</span>
        </Divider>

        <ButtonOutline as={Link} to="/login">
          Sign In
        </ButtonOutline>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
