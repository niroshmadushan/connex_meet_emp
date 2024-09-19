// src/pages/Login.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email'; // Added Email Icon
import LockIcon from '@mui/icons-material/Lock'; // Added Lock Icon
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Theme colors
const themeColor = {
  primary: '#007aff', // iOS-like blue color
  primaryHover: '#005bb5',
  textPrimary: '#333333', // Primary text color for better contrast
  cardBg: '#ffffff', // White background for cards
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: themeColor.cardBg,
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
  transition: 'all 0.3s ease-in-out', // Added transition for animation
  ':hover': {
    transform: 'scale(1.02)', // Slight scale on hover
    boxShadow: '0 6px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: '20px',
  marginBottom: '20px',
  padding: '10px',
  fontSize: '1rem',
  fontWeight: 'bold',
  backgroundColor: themeColor.primary,
  color: '#fff',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  ':hover': {
    backgroundColor: themeColor.primaryHover,
    transform: 'translateY(-2px)', // Button hover effect
  },
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement your login logic here (e.g., API call)
    if (email === '' || password === '') {
      setError('Please enter both email and password.');
      return;
    }

    // Reset error
    setError('');
    console.log('Login Successful:', { email, password });

    // Redirect to dashboard on successful login
    navigate('/dash');
  };

  return (
    <Container sx={{ mt: 1 , display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <StyledPaper elevation={3}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: themeColor.primary }}>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={handleEmailChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <LoginButton type="submit" fullWidth variant="contained">
            Login
          </LoginButton>
        </form>
        <Typography variant="body2" align="center">
          Don't have an account? <a href="/register" style={{ color: themeColor.primary }}>Register</a>
        </Typography>
      </StyledPaper>
    </Container>
  );
};

export default Login;
