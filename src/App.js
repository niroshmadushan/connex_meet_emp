import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Home from './pages/ScheduledMeetings';
import HomeDashboard from './pages/Dashboard';
import MeetingRooms from './pages/MeetingRooms';
import AddMeetingSession from './pages/AddMeetingSession';
import AddMeetingInternal from './pages/AddMeetingInternal';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/RegistrationPage';
import Layout from './pages/Layout';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider, AuthContext } from './pages/AuthContext'; // Make sure the path is correct
import PrivateRoute from './components/PrivateRoute'; // Make sure the path is correct
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only show the loading screen if authenticated, for a delay before redirection
    if (isAuthenticated) {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000); // 5 seconds loading screen
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Redirect if authenticated and loading is done */}
      {isAuthenticated ? (
        <Route path="*" element={<Navigate replace to="/connex_meet_emp/dash" />} />
      ) : (
        <>
          <Route path="/connex_meet_emp/" element={<Login />} />
          <Route path="/connex_meet_emp/reg" element={<Register />} />
          <Route path="/connex_meet_emp/dash" element={<PrivateRoute><Layout><HomeDashboard /></Layout></PrivateRoute>} />
          <Route path="/connex_meet_emp/eventspage" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
          <Route path="/connex_meet_emp/meeting-rooms" element={<PrivateRoute><Layout><MeetingRooms /></Layout></PrivateRoute>} />
          <Route path="/connex_meet_emp/addmeeting" element={<PrivateRoute><Layout><AddMeetingSession /></Layout></PrivateRoute>} />
          <Route path="/connex_meet_emp/addInternalMeeting" element={<PrivateRoute><Layout><AddMeetingInternal /></Layout></PrivateRoute>} />
          <Route path="/connex_meet_emp/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
        </>
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
