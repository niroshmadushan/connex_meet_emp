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
import axios from 'axios';
import Swal from 'sweetalert2';  // Import SweetAlert2
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

// Theme colors
const themeColor = {
  primary: '#0d6efd',
  textPrimary: '#333333',
  cardBg: '#ffffff',
  error: '#dc3545',
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
  position: 'relative',
}));

const ProfileContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: '-75px',
  left: '50%',
  transform: 'translateX(-50%)',
});

const StyledAvatar = styled(Avatar)({
  width: 120,
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
    designation: '',
    password: '',
    confirmPassword: '',
    org_id: '',  // Add org_id to the state
    profilePictureBase64: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  const navigate = useNavigate();  // Initialize useNavigate for redirecting

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];  // Extract only the base64 part
        setFormData({
          ...formData,
          profilePictureBase64: base64String,  // Set Base64 string in form data
        });
        setProfilePreview(reader.result);  // Set preview for the image
      };
      reader.readAsDataURL(file);  // Convert image to Base64
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, phone, address, designation, password, confirmPassword, org_id, profilePictureBase64 } = formData;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Passwords do not match.",
        confirmButtonColor: themeColor.primary,
      });
      return;
    }

    if (name === '' || email === '' || phone === '' || address === '' || designation === '' || password === '' || confirmPassword === '' || org_id === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Please fill in all fields.",
        confirmButtonColor: themeColor.primary,
      });
      return;
    }

    const data = {
      name,
      email,
      phone,
      address,
      designation,
      password,
      status: '1',
      org_id,  // Include org_id in the request
      image: profilePictureBase64,
    };

    try {
      const response = await axios.post('http://10.33.0.255:3001/add-user', data);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Employee added successfully.',
          confirmButtonColor: themeColor.primary,
        }).then(() => {
          // Redirect to login page after successful registration
          navigate('/connex_meet_emp/');  // Redirect to the login page
        });

        // Clear the form
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          designation: '',
          password: '',
          confirmPassword: '',
          org_id: '',  // Clear the org_id field as well
          profilePictureBase64: '',
        });
        setProfilePreview(null);
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Failed to register';

      if (errorMessage === 'User with the same email already exists') {
        // Show Swal alert only for this specific error
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'User with the same email already exists.',
          confirmButtonColor: themeColor.primary,
        });
      } else {
        // Show Swal alert for any other errors
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorMessage,
          confirmButtonColor: themeColor.primary,
        });
      }
    }
  };

  return (
    <Container sx={{ mt: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <StyledPaper elevation={6}>
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
          {/* Add org_id input */}
          <TextField
            fullWidth
            label="Organization ID"
            variant="outlined"
            margin="normal"
            name="org_id"
            value={formData.org_id}
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
      </StyledPaper>
    </Container>
  );
};

export default Register;
