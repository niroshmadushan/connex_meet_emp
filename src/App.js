// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Home from './pages/Home';
import HomeDashboard from './pages/Dashboard';
import MeetingRooms from './pages/MeetingRooms';
import AddMeetingSession from './pages/AddMeetingSession';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/RegistrationPage';
import Layout from './pages/Layout'; // Import Layout
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Typography, Box } from '@mui/material';

const App = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [countdown, setCountdown] = useState(5); // 5-second countdown

  useEffect(() => {
    // Check the screen width and update the state accordingly
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Assuming 768px as the mobile threshold
    };

    // Initial check
    checkScreenSize();

    // Listen for resize events to adjust the screen size
    window.addEventListener('resize', checkScreenSize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      // If not on a mobile device, set up a countdown for redirection
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1; // Decrement the countdown
          } else {
            clearInterval(timer); // Clear interval when countdown reaches 0
            window.location.href = "https://www.connexit.biz/"; // Redirect after 5 seconds
          }
          return prev;
        });
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(timer);
    }
  }, [isMobile]);

  if (!isMobile) {
    // Display a message with a countdown if not on a mobile device
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography variant="h4" color="error" textAlign="center">
          This application is only available on mobile devices.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginTop: '20px' }}>
          Redirecting in {countdown} seconds...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Wrap each route with Layout */}
          <Route path="/" element={<Login />} />
          <Route path="/dash" element={<Layout><HomeDashboard /></Layout>} />
          <Route path="/eventspage" element={<Layout><Home /></Layout>} />
          <Route path="/meeting-rooms" element={<Layout><MeetingRooms /></Layout>} />
          <Route path="/addmeeting" element={<Layout><AddMeetingSession /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
