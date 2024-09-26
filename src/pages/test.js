// src/App.js
import React, { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import theme from './theme/theme';
import Home from './pages/ScheduledMeetings';
import HomeDashboard from './pages/Dashboard';
import MeetingRooms from './pages/MeetingRooms';
import AddMeetingSession from './pages/AddMeetingSession';
import AddMeetingInternal from './pages/AddMeetingInternal';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/RegistrationPage';
import Layout from './pages/Layout'; // Import Layout
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Authentication context
export const AuthContext = createContext();

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // Get authentication state from context
  return isAuthenticated ? children : <Navigate to="/connex_meet_emp/" />; // Redirect if not authenticated
};

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext); // Get authentication state from context

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/connex_meet_emp/" element={<Login />} />
      <Route path="/connex_meet_emp/reg" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/connex_meet_emp/dash"
        element={
          <PrivateRoute>
            <Layout>
              <HomeDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/connex_meet_emp/eventspage"
        element={
          <PrivateRoute>
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/connex_meet_emp/meeting-rooms"
        element={
          <PrivateRoute>
            <Layout>
              <MeetingRooms />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/connex_meet_emp/addmeeting"
        element={
          <PrivateRoute>
            <Layout>
              <AddMeetingSession />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/connex_meet_emp/addInternalMeeting"
        element={
          <PrivateRoute>
            <Layout>
              <AddMeetingInternal />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/connex_meet_emp/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // JWT Token verification on app load
    const checkAuthStatus = async () => {
      try {
        // Call the verification API to check the token validity
        const response = await axios.post('http://192.168.13.150:3000/verifytoken', {}, { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true); // Set the user as authenticated if token is valid
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false); // Set as not authenticated if token is invalid
          console.log('Unauthorized user');
        } else {
          console.error('Error verifying token:', error);
        }
      }
    };

    checkAuthStatus();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;
