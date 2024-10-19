import React, { useContext } from 'react';
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
import { AuthProvider, AuthContext } from './pages/AuthContext'; // Make sure this import is correct
import PrivateRoute from './components/PrivateRoute';

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext); // Use the context

  return (
    <Routes>
      {/* Redirect if authenticated */}
      {isAuthenticated && (
        <Route path="connex_meet_emp/" element={<Navigate replace to="/connex_meet_emp/dash" />} />
      )}

      {/* Public routes */}
      <Route path="/connex_meet_emp/" element={<Login />} />
      <Route path="/connex_meet_emp/reg" element={<Register />} />

      {/* Protected routes */}
      <Route path="/connex_meet_emp/dash" element={<PrivateRoute><HomeDashboard /></PrivateRoute>} />
      <Route path="/connex_meet_emp/eventspage" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
      <Route path="/connex_meet_emp/meeting-rooms" element={<PrivateRoute><Layout><MeetingRooms /></Layout></PrivateRoute>} />
      <Route path="/connex_meet_emp/addmeeting" element={<PrivateRoute><Layout><AddMeetingSession /></Layout></PrivateRoute>} />
      <Route path="/connex_meet_emp/addInternalMeeting" element={<PrivateRoute><Layout><AddMeetingInternal /></Layout></PrivateRoute>} />
      <Route path="/connex_meet_emp/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
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
