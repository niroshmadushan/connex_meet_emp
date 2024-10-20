// src/components/Layout.js
import React from 'react';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import MapIcon from '@mui/icons-material/Map';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd'; // Import the new icon
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
      case '/connex_meet_emp/eventspage':
        setSelectedView('events');
        break;
      case '/connex_meet_emp/meeting-rooms':
        setSelectedView('map');
        break;
      case '/connex_meet_emp/addmeeting':
        setSelectedView('addmeeting');
        break;
      case '/connex_meet_emp/profile':
        setSelectedView('profile');
        break;
      case '/connex_meet_emp/addInternalMeeting': // Update for internal staff meetings page
        setSelectedView('staffmeeting');
        break;
      default:
        setSelectedView('home');
    }
  }, [location.pathname]);

  const handleNavigationChange = (view) => {
    setSelectedView(view);

    switch (view) {
      case 'home':
        navigate('/connex_meet_emp/dash');
        break;
      case 'events':
        navigate('/connex_meet_emp/eventspage');
        break;
      case 'map':
        navigate('/connex_meet_emp/meeting-rooms');
        break;
      case 'addmeeting':
        navigate('/connex_meet_emp/addmeeting');
        break;
      case 'profile':
        navigate('/connex_meet_emp/profile');
        break;
      case 'staffmeeting': // Handle navigation for internal staff meeting
        navigate('/connex_meet_emp/addInternalMeeting');
        break;
      default:
        navigate('/connex_meet_emp/');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: 'auto', bgcolor: themeColor.background, overflow: 'hidden' }}>
    
      <Box>
        {children}
      </Box>

      {/* Footer Section */}
      {/* <FooterNavigation>
        <FooterButton onClick={() => handleNavigationChange('home')} className={selectedView === 'home' ? 'Mui-selected' : ''}>
          <HomeIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('events')} className={selectedView === 'events' ? 'Mui-selected' : ''}>
          <EventNoteIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('addmeeting')} className={selectedView === 'addmeeting' ? 'Mui-selected' : ''}>
          <DashboardCustomizeIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('staffmeeting')} className={selectedView === 'staffmeeting' ? 'Mui-selected' : ''}>
          <GroupAddIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('map')} className={selectedView === 'map' ? 'Mui-selected' : ''}>
          <MapIcon />
        </FooterButton>
        <FooterButton onClick={() => handleNavigationChange('profile')} className={selectedView === 'profile' ? 'Mui-selected' : ''}>
          <PersonOutlineIcon />
        </FooterButton>
      </FooterNavigation> */}
    </Box>
  );
};

export default Layout;
