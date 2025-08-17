
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Login from './components/Login';
import FaceLogin from './components/FaceLogin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FaceRegistration from './components/FaceRegistration';
import ExamSession from './components/ExamSession';
import Exams from './components/Exams';
import ExamVerification from './components/ExamVerification';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  body {
    background-color: #0a0e27;
    color: #ffffff;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

// Futuristic Theme
const theme = {
  colors: {
    primary: '#4a9eff',
    secondary: '#00d4ff',
    accent: '#ff00aa',
    background: '#0a0e27',
    surface: '#151935',
    surfaceLight: '#1e2341',
    text: '#ffffff',
    textSecondary: '#a0aec0',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
  },
  borderRadius: '12px',
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    neon: '0 0 15px rgba(74, 158, 255, 0.6), 0 0 30px rgba(74, 158, 255, 0.3)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
};

// App Container
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #151935 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 30%, rgba(74, 158, 255, 0.1) 0%, rgba(10, 14, 39, 0) 20%),
                radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.1) 0%, rgba(10, 14, 39, 0) 20%);
    z-index: 0;
  }
`;

// Main Content
const MainContent = styled.main`
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 20px;
`;

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    isAuthenticated: !!localStorage.getItem('token'),
  });

  // Set up axios defaults
  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [auth.token]);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({
      token,
      user,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      token: null,
      user: {},
      isAuthenticated: false,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <AuthContext.Provider value={{ auth, login, logout }}>
          <Router>
            <MainContent>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/face-login" element={<FaceLogin />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={auth.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/face-registration" 
                  element={auth.isAuthenticated ? <FaceRegistration /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/exam-session/:examId" 
                  element={auth.isAuthenticated ? <ExamSession /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/exams" 
                  element={auth.isAuthenticated ? <Exams /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/exam-verification/:examId" 
                  element={auth.isAuthenticated ? <ExamVerification /> : <Navigate to="/login" />} 
                />
              </Routes>
            </MainContent>
          </Router>
        </AuthContext.Provider>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
