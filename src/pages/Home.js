// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Grid
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import MapIcon from '@mui/icons-material/Map';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import logo from '../img/logo.png';
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';
import HomeDashboard from './HomeDashboard';
import MeetingRooms from './MeetingRooms'; // Import the new MeetingRooms component

// Theme colors and styles for light theme
const themeColor = {
  primary: '#007aff', // iOS-like blue color
  primaryDark: '#005bb5',
  background: '#f9f9f9', // Light background color
  headerBg: '#ffffff', // White background for header
  headerTextColor: '#333333', // Darker text for contrast
  borderColor: '#e0e0e0',
  textPrimary: '#333333', // Primary text color for better contrast
  cardBg: '#ffffff', // Light background for cards
  rowHoverHighlight: '#f0f4f8',
};

// Sample meeting data
const meetingData = [
  {
    title: "Project Kickoff",
    date: "2024-09-10",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    location: "Conference Room A",
    type: "Meeting",
    participants: "John, Alice, Bob",
    specialNote: "Please review the project scope beforehand."
  },
  {
    title: "Team Sync",
    date: "2024-09-11",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    location: "Zoom",
    type: "Session",
    participants: "Team A",
    specialNote: "Weekly sync-up."
  },
  {
    title: "Client Presentation",
    date: "2024-09-12",
    startTime: "01:00 PM",
    endTime: "02:30 PM",
    location: "Main Hall",
    type: "Presentation",
    participants: "Client A, Team B",
    specialNote: "Ensure presentation is ready."
  },
  {
    title: "Design Review",
    date: "2024-09-13",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    location: "Conference Room B",
    type: "Review",
    participants: "Design Team",
    specialNote: "Bring all design drafts."
  },
];

// Custom styled BottomNavigation for iOS-inspired look
const FooterNavigation = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)', // White background with slight transparency
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

// Custom styled components for cards
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: themeColor.cardBg,
  color: themeColor.textPrimary,
  marginBottom: '8px', // Reduce margin to make cards closer
  borderRadius: '8px', // Reduced border radius for a more compact look
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // Lighter shadow for less prominence
  width: '100%',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cursor: 'pointer',
}));

const Home = () => {
  const [selectedView, setSelectedView] = useState('home');
  const [open, setOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Determine the selected view based on the current path
    if (location.pathname === '/eventspage') {
      setSelectedView('events');
    } else {
      setSelectedView('home');
    }
  }, [location.pathname]);

  const handleNavigationChange = (view) => {
    setSelectedView(view);

    if (view === 'home') {
      navigate('/'); // Navigate to the home route
    } else if (view === 'events') {
      navigate('/eventspage'); // Navigate to the events page
    } else if (view === 'map') {
      navigate('/meeting-rooms'); // Navigate to the meeting rooms page
    }
  };

  const handleCardClick = (meeting) => {
    setSelectedMeeting(meeting);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 'auto', bgcolor: themeColor.background, overflow: 'hidden' }}>
     
      {/* Upcoming Meetings */}
      {selectedView === 'events' && (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '20px' }}>
          <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 'bold', color: themeColor.textPrimary }}>
            Upcoming Meetings
          </Typography>
          <Box sx={{ width: '100%', maxWidth: '600px' }}>
            {meetingData.map((meeting, index) => (
              <StyledCard key={index} onClick={() => handleCardClick(meeting)}>
                <CardContent sx={{ padding: '8px 12px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, fontSize: '0.9rem', fontWeight: 'bold' }}>{meeting.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: '1rem', color: themeColor.primary, mr: 1 }} />
                    <Typography variant="body2" sx={{ color: themeColor.textPrimary, fontSize: '0.75rem', mr: 2 }}>{meeting.date}</Typography>
                    <AccessTimeIcon sx={{ fontSize: '1rem', color: themeColor.primary, mr: 1 }} />
                    <Typography variant="body2" sx={{ color: themeColor.textPrimary, fontSize: '0.75rem', mr: 2 }}>{meeting.startTime} - {meeting.endTime}</Typography>
                    <RoomIcon sx={{ fontSize: '1rem', color: themeColor.primary, mr: 1 }} />
                    <Typography variant="body2" sx={{ color: themeColor.textPrimary, fontSize: '0.75rem' }}>{meeting.location}</Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            ))}
          </Box>
        </Container>
      )}

      {/* Meeting Details Popup */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '16px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: themeColor.primary, fontWeight: 'bold' }}>
          {selectedMeeting?.title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={6}><Typography variant="body2"><strong>Title:</strong></Typography></Grid>
            <Grid item xs={6}><Typography variant="body2">{selectedMeeting?.title}</Typography></Grid>
            
            {/* Date */}
            <Grid item xs={6}><Typography variant="body2"><strong>Date:</strong></Typography></Grid>
            <Grid item xs={6}><Typography variant="body2">{selectedMeeting?.date}</Typography></Grid>
            
            {/* Start Time */}
            <Grid item xs={6}><Typography variant="body2"><strong>Start Time:</strong></Typography></Grid>
            <Grid item xs={6}><Typography variant="body2">{selectedMeeting?.startTime}</Typography></Grid>
            
            {/* End Time */}
            <Grid item xs={6}><Typography variant="body2"><strong>End Time:</strong></Typography></Grid>
            <Grid item xs={6}><Typography variant="body2">{selectedMeeting?.endTime}</Typography></Grid>
            
            {/* Location */}
            <Grid item xs={6}><Typography variant="body2"><strong>Location:</strong></Typography></Grid>
            <Grid item xs={6}><Typography variant="body2">{selectedMeeting?.location}</Typography></Grid>
            
            {/* Type of Event */}
            <Grid item xs={6}><Typography variant="body2"><strong>Type of Event:</strong></Typography></Grid>
            <Grid item xs={6}><Typography variant="body2">{selectedMeeting?.type}</Typography></Grid>
            
            {/* Participants */}
            <Grid item xs={6}><Typography variant="body2"><strong>Participants:</strong></Typography></Grid>
            <Grid item xs={6}><Typography variant="body2">{selectedMeeting?.participants}</Typography></Grid>
            
            {/* Special Notes */}
            <Grid item xs={12}><Typography variant="body2"><strong>Special Notes:</strong></Typography></Grid>
            <Grid item xs={12}><Typography variant="body2">{selectedMeeting?.specialNote}</Typography></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: themeColor.primary, color: '#fff' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
