import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Box,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { format, isSameDay } from 'date-fns';
import Swal from 'sweetalert2';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'; // Use a meeting room icon
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Calendar icon
import CloseIcon from '@mui/icons-material/Close'; // Close button icon
import APIConnection from '../config';

// Updated theme colors
const themeColor = {
  primary: '#1e88e5', // Bright blue for primary color
  secondary: '#0288d1', // Light blue
  textPrimary: '#333333',
  textSecondary: '#777777',
  cardBg: '#ffffff',
  lightGray: '#f0f0f0',
  accent: '#ff6f61',
};

// Custom scrollbar styles for scrollable content
const ScrollableContent = styled(Box)({
  maxHeight:'75vh',
  height:'70vh', // Account for fixed header and footer
  overflowY: 'scroll',
  paddingTop: '20px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#747474',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: themeColor.secondary,
  },
});

// Custom styled components for cards
const StyledCard = styled(Card)(({ available }) => ({
  backgroundColor: themeColor.cardBg,
  color: themeColor.textPrimary,
  borderRadius: '15px',
  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
  height: '140px',
  width:'200px',
  position: 'relative',
  cursor: 'pointer',
  padding: '15px',
  marginBottom:'10px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

// Blinking availability dot
const BlinkingDot = styled(Box)(({ available }) => ({
  position: 'absolute',
  top: '15px',
  right: '15px',
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: available ? '#4caf50' : '#f44336',
  animation: 'blink 1s infinite',
  '@keyframes blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0 },
  },
}));

const MeetingRooms = () => {
  const [rooms, setRooms] = useState([]); // State for storing rooms data
  const [bookings, setBookings] = useState([]); // State for storing all bookings
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get('http://10.33.0.255:3001/place', {
          withCredentials: true,
        });
        setRooms(roomsResponse.data);

        const bookingsResponse = await axios.get('http://10.33.0.255:3001/bookings', {
          withCredentials: true,
        });
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Failed to fetch room and booking data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (room) => {
    const availableSlots = getAvailableTimeSlots(room);

    if (availableSlots.length === 0) {
      Swal.fire({
        title: 'Unavailable',
        text: 'This room has no available time slots for the selected date.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    setSelectedRoom(room);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoom(null);
  };

  // Calculate available time slots for the selected room based on the selected date
  const getAvailableTimeSlots = (room) => {
    const startTime = room.start_time;
    const endTime = room.end_time;

    const convertTime = (time) => {
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      return adjustedHours * 100 + minutes;
    };

    const roomStart = convertTime(startTime);
    const roomEnd = convertTime(endTime);

    const roomBookings = bookings.filter(
      (booking) => booking.place_id === room.id && isSameDay(new Date(booking.date), selectedDate)
    );

    if (roomBookings.length === 0) {
      return [`${startTime} - ${endTime}`];
    }

    const sortedBookings = roomBookings
      .map((booking) => ({
        start: convertTime(booking.start_time),
        end: convertTime(booking.end_time),
      }))
      .sort((a, b) => a.start - b.start);

    const freeSlots = [];
    let lastEndTime = roomStart;

    sortedBookings.forEach((booking) => {
      if (lastEndTime < booking.start) {
        freeSlots.push({ start: lastEndTime, end: booking.start });
      }
      lastEndTime = Math.max(lastEndTime, booking.end);
    });

    if (lastEndTime < roomEnd) {
      freeSlots.push({ start: lastEndTime, end: roomEnd });
    }

    const formatTime = (time) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    return freeSlots.map((slot) => `${formatTime(slot.start)} - ${formatTime(slot.end)}`);
  };

  return (
    <Container

      sx={{
        mt:5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden', // Prevent body scrolling
        padding: '20px',
        
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          borderRadius:'20px',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 2,
          width: '100%',
          padding: '10px 0',
          display: 'flex',
          justifyContent: 'space-between', // Space between the title and date picker
          alignItems: 'center',
        }}
      >
        {/* Title on the Left */}
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: themeColor.textPrimary,
            ml: 3, // Left margin for spacing
          }}
        >
          Meeting Rooms Availability
        </Typography>

        {/* Date Picker on the Right */}
        <Box display="flex" alignItems="center" mr={3}> {/* Right margin for spacing */}
          <CalendarTodayIcon sx={{ color: themeColor.primary, mr: 1 }} />
          <TextField
            label="Select Date"
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            sx={{ width: '200px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </Box>
      {/* Fixed Header */}
      

      {/* Scrollable Room Cards Area */}
      <ScrollableContent>
        <Grid container spacing={3} sx={{ width: '100%', maxWidth: '1200px' ,padding:'10px'}}>
          {rooms.map((room, index) => {
            const availableSlots = getAvailableTimeSlots(room);
            const isAvailable = availableSlots.length > 0;

            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledCard available={isAvailable} onClick={() => handleCardClick(room)}>
                  <BlinkingDot available={isAvailable} />
                  <CardContent sx={{ padding: '10px' }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <MeetingRoomIcon sx={{ color: themeColor.primary, mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {room.name || 'Unavailable'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', color: themeColor.textSecondary }}>
                      {room.address}
                    </Typography>
                    {isAvailable ? (
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                        Available
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                        Not Available
                      </Typography>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>
            );
          })}
        </Grid>
      </ScrollableContent>

      {/* Popup Dialog for Room Details */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
        PaperProps={{
          sx: { borderRadius: '15px', width: '400px' },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: themeColor.primary, fontWeight: 'bold' }}>
          {selectedRoom?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: themeColor.textPrimary, mb: 1 }}>
            {selectedRoom?.address}
          </Typography>
          {selectedRoom && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                Available Time Slots for {format(selectedDate, 'MM/dd/yyyy')}:
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', marginTop: '10px' }}>
                <Table size="small" aria-label="available time slots">
                  <TableBody>
                    {getAvailableTimeSlots(selectedRoom).map((slot, idx) => (
                      <TableRow key={idx}>
                        <TableCell
                          align="center"
                          sx={{ fontSize: '0.75rem', color: themeColor.textPrimary, border: `1px solid ${themeColor.lightGray}` }}
                        >
                          {slot}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              backgroundColor: themeColor.primary,
              color: '#fff',
              '&:hover': { backgroundColor: themeColor.secondary },
            }}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MeetingRooms;
