// src/components/Layout.js
import React from 'react';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import MapIcon from '@mui/icons-material/Map';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../img/logo.png';

// Theme colors
const themeColor = {
  primary: '#007aff',
  headerBg: '#ffffff',
  headerTextColor: '#333333',
  textPrimary: '#333333',
};

// Custom styled BottomNavigation for iOS-inspired look
const FooterNavigation = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '60px',
  zIndex: 2,
  padding: '10px 0',
  boxShadow: '0 -2px 15px rgba(0,0,0,0.05)',
}));

const FooterButton = styled(IconButton)(({ theme }) => ({
  color: themeColor.textPrimary,
  '&.Mui-selected': {
    color: themeColor.primary,
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
  transition: 'color 0.3s ease',
}));

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedView, setSelectedView] = React.useState('home');

  React.useEffect(() => {
    // Determine the selected view based on the current path
    switch (location.pathname) {
      case '/eventspage':
        setSelectedView('events');
        break;
      case '/meeting-rooms':
        setSelectedView('map');
        break;
      case '/addmeeting':
        setSelectedView('addmeeting');
        break;
      case '/profile':
        setSelectedView('profile');
        break;
      default:
        setSelectedView('home');
    }
  }, [location.pathname]);

  const handleNavigationChange = (view) => {
    setSelectedView(view);

    switch (view) {
      case 'home':
        navigate('/');
        break;
      case 'events':
        navigate('/eventspage');
        break;
      case 'map':
        navigate('/meeting-rooms');
        break;
      case 'addmeeting':
        navigate('/addmeeting');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: 'auto', bgcolor: themeColor.background, overflow: 'hidden' }}>
      {/* Header Section */}
      <AppBar position="fixed" sx={{ background: themeColor.headerBg, boxShadow: 'none', color: themeColor.headerTextColor, top: 0, zIndex: 3 }}>
        <Toolbar>
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box sx={{ flex: 1, overflowY: 'auto', paddingTop: '64px', paddingBottom: '60px' }}>
        {children}
      </Box>

      {/* Footer Section */}
      <FooterNavigation>
        <FooterButton onClick={() => handleNavigationChange('home')} className={selectedView === 'home' ? 'Mui-selected' : ''}>
          <HomeIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('events')} className={selectedView === 'events' ? 'Mui-selected' : ''}>
          <EventNoteIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('addmeeting')} className={selectedView === 'addmeeting' ? 'Mui-selected' : ''}>
          <DashboardCustomizeIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('map')} className={selectedView === 'map' ? 'Mui-selected' : ''}>
          <MapIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('profile')} className={selectedView === 'profile' ? 'Mui-selected' : ''}>
          <PersonOutlineIcon />
        </FooterButton>
      </FooterNavigation>
    </Box>
  );
};

export default Layout;
