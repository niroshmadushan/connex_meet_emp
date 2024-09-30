// src/pages/MeetingRooms.js
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
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

// Theme colors
const themeColor = {
  primary: '#007aff',
  textPrimary: '#333333',
  cardBg: '#ffffff',
  availableBg: '#e0f7e9',
  unavailableBg: '#f8d7da',
  lightGray: '#e0e0e0',
};

// Custom styled components
const StyledCard = styled(Card)(({ available }) => ({
  backgroundColor: themeColor.cardBg,
  color: themeColor.textPrimary,
  marginBottom: '8px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  height: '120px',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  cursor: 'pointer',
  padding: '10px',
}));

const BlinkingDot = styled(Box)(({ available }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: available ? '#4caf50' : '#f44336',
  animation: 'blink 1s infinite',
  '@keyframes blink': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
  },
}));

const MeetingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms with credentials
        const roomsResponse = await axios.get('http://192.168.13.150:3001/place', {
          withCredentials: true,
        });

        // Log the entire response to check its structure
        console.log('Rooms Response:', roomsResponse);

        // Check if the response is an array of rooms
        if (Array.isArray(roomsResponse.data)) {
          const roomsData = roomsResponse.data;

          // Fetch bookings for each room with credentials
          const bookingsPromises = roomsData.map((room) =>
            axios.get(`http://192.168.13.150:3001/bookings/${room.id}`, {
              withCredentials: true,
            })
          );

          // Fetch and associate bookings
          const bookingsResponses = await Promise.all(bookingsPromises);
          const roomsWithBookings = roomsData.map((room, index) => ({
            ...room,
            bookings: bookingsResponses[index].data,
          }));

          setRooms(roomsWithBookings);
        } else {
          console.error('Invalid data format: Expected an array of rooms.');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (room) => {
    setSelectedRoom(room);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoom(null);
  };

  // Function to calculate available time slots for a room
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

    const sortedBookings = room.bookings
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
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '20px' }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold', color: themeColor.textPrimary }}>
        Meeting Rooms
      </Typography>
      <Grid container spacing={2} sx={{ width: '100%', maxWidth: '600px' }}>
        {rooms.map((room, index) => (
          <Grid item xs={12} key={index}>
            <StyledCard available={room.status_id === 4} onClick={() => handleCardClick(room)}>
              <BlinkingDot available={room.status_id === 4} />
              <CardContent sx={{ padding: '10px' }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5, fontSize: '1rem', fontWeight: 'bold' }}>
                  {room.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem', color: themeColor.textPrimary }}>
                  {room.address}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Popup Dialog for Room Details */}
      <Dialog open={open} onClose={handleClose} TransitionComponent={Slide} TransitionProps={{ direction: 'up', timeout: 400 }}>
        <DialogTitle sx={{ textAlign: 'center', color: themeColor.primary, fontWeight: 'bold' }}>{selectedRoom?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: themeColor.textPrimary, mb: 1 }}>{selectedRoom?.address}</Typography>
          {selectedRoom?.available ? (
            <TableContainer component={Paper} sx={{ boxShadow: 'none', marginTop: '10px' }}>
              <Table size="small" aria-label="available time slots">
                <TableBody>
                  {getAvailableTimeSlots(selectedRoom).map((slot, idx) => (
                    <TableRow key={idx}>
                      <TableCell align="center" sx={{ fontSize: '0.75rem', color: themeColor.textPrimary, border: `1px solid ${themeColor.lightGray}` }}>
                        {slot}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#d32f2f' }}>
              Currently Not Available
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: themeColor.primary, color: '#fff' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MeetingRooms;
