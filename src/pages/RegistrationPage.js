// src/pages/Register.js
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
  Avatar,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import { styled, keyframes } from '@mui/system';

// Theme colors
const themeColor = {
  primary: '#0d6efd', // Premium blue color
  textPrimary: '#333333', // Primary text color for better contrast
  cardBg: '#ffffff', // White background for cards
  error: '#dc3545', // Error color for validation messages
};

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: themeColor.cardBg,
  padding: '50px 30px 30px 30px',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
  maxWidth: '600px',
  width: '100%',
  animation: `${fadeIn} 0.8s ease-out`,
  position: 'relative', // Make room for top profile image
}));

const ProfileContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: '-75px', // Raise the profile picture above the card
  left: '50%',
  transform: 'translateX(-50%)', // Center horizontally
});

const StyledAvatar = styled(Avatar)({
  width: 120, // Larger profile image
  height: 120,
  marginBottom: '8px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    designation: '', // Updated field
    password: '',
    confirmPassword: '',
    profilePicture: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, phone, address, designation, password, confirmPassword } = formData;

    // Simple validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (name === '' || email === '' || phone === '' || address === '' || designation === '' || password === '' || confirmPassword === '') {
      setError("Please fill in all fields.");
      return;
    }

    // Reset error
    setError('');
    
    // Implement your registration logic here (e.g., API call)
    console.log('Registration Successful:', { name, email, phone, address, designation, password, profilePicture: formData.profilePicture });

    // Clear the form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      designation: '',
      password: '',
      confirmPassword: '',
      profilePicture: '',
    });
    setProfilePreview(null);
  };

  return (
    <Container sx={{ mt: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <StyledPaper elevation={6}>
        {/* Profile Picture and Upload Button */}
        <ProfileContainer>
          <StyledAvatar src={profilePreview} alt="Profile Picture" />
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ mt: 1, backgroundColor: themeColor.primary, color: '#fff', textTransform: 'none' }}
          >
            Upload
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfilePictureChange}
            />
          </Button>
        </ProfileContainer>

        {/* Form Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            color: themeColor.primary,
            position: 'absolute',
            top: 16,
            left: 16,
          }}
        >
          Register
        </Typography>

        {/* Registration Form */}
        <form onSubmit={handleRegister} style={{ marginTop: '60px' }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            margin="normal"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Address"
            variant="outlined"
            margin="normal"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Designation"
            variant="outlined"
            margin="normal"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
              required
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
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
              label="Confirm Password"
              required
            />
          </FormControl>
          {error && (
            <Typography variant="body2" color={themeColor.error} sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2, backgroundColor: themeColor.primary, textTransform: 'none' }}
          >
            Register
          </Button>
        </form>

        {/* Login Link */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <a href="/login" style={{ color: themeColor.primary }}>Login</a>
        </Typography>
      </StyledPaper>
    </Container>
  );
};

export default Register;
