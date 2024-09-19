// src/pages/MeetingRooms.js
import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
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
  TableCell
} from '@mui/material';
import { styled } from '@mui/system';

// Theme colors
const themeColor = {
  primary: '#007aff', // iOS-like blue color
  textPrimary: '#333333', // Primary text color for better contrast
  cardBg: '#ffffff', // White background for cards
  availableBg: '#e0f7e9', // Light green background for available rooms
  unavailableBg: '#f8d7da', // Light red background for unavailable rooms
  lightGray: '#e0e0e0', // Light gray color for borders
};

// Sample data for meeting rooms
const meetingRooms = [
  { name: 'Conference Room A', available: true, timeSlots: ['10:00 AM - 11:00 AM', '01:00 PM - 02:00 PM'], details: 'Capacity: 10, Projector available' },
  { name: 'Conference Room B', available: false, timeSlots: [], details: 'Capacity: 20, Whiteboard available' },
  { name: 'Main Hall', available: true, timeSlots: ['09:00 AM - 10:00 AM', '02:00 PM - 03:00 PM'], details: 'Capacity: 50, Stage available' },
];

// Custom styled components for cards
const StyledCard = styled(Card)(({ available }) => ({
  backgroundColor: themeColor.cardBg,
  color: themeColor.textPrimary,
  marginBottom: '8px', // Reduce margin to make cards closer
  borderRadius: '12px', // More rounded corners for a premium look
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for a premium look
  width: '100%',
  height:'120px',
  position: 'relative', // Needed for blinking dot
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
  backgroundColor: available ? '#4caf50' : '#f44336', // Green for available, Red for not available
  animation: 'blink 1s infinite', // Blinking animation
  '@keyframes blink': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginRight: '2px',
  width: '100%',
  marginTop: '5px',
  backgroundColor: themeColor.primary,
  color: '#ffffff',
  fontSize: '0.65rem',
  '&:hover': {
    backgroundColor: themeColor.primaryDark,
  },
}));

const MeetingRooms = () => {
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleCardClick = (room) => {
    setSelectedRoom(room);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoom(null);
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '20px' }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: '1.2rem', fontWeight: 'bold', color: themeColor.textPrimary }}>
        Meeting Rooms
      </Typography>
      <Grid container spacing={2} sx={{ width: '100%', maxWidth: '600px' }}>
        {meetingRooms.map((room, index) => (
          <Grid item xs={12} key={index}>
            <StyledCard available={room.available} onClick={() => handleCardClick(room)}>
              {/* Blinking dot to indicate availability status */}
              <BlinkingDot available={room.available} />
              <CardContent sx={{ padding: '10px' }}>
                <Typography variant="subtitle1" sx={{ mb: 0.5, fontSize: '1rem', fontWeight: 'bold' }}>
                  {room.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem', color: themeColor.textPrimary }}>
                  {room.details}
                </Typography>
                {room.available ? (
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#388e3c' }}>
                    Available
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#d32f2f' }}>
                    Not Available
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Popup Dialog for Room Details */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '5px',
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', color: themeColor.primary, fontWeight: 'bold' }}>
          {selectedRoom?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: themeColor.textPrimary, mb: 1 }}>
            {selectedRoom?.details}
          </Typography>
          {selectedRoom?.available ? (
            <>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#388e3c' }}>
                Available Time Slots:
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', marginTop: '10px' }}>
                <Table size="small" aria-label="available time slots">
                  <TableBody>
                    {selectedRoom.timeSlots.map((slot, idx) => (
                      <TableRow key={idx}>
                        <TableCell align="center" sx={{ fontSize: '0.75rem', color: themeColor.textPrimary, border: `1px solid ${themeColor.lightGray}` }}>
                          {slot}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#d32f2f' }}>
              Currently Not Available
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: themeColor.primary, color: '#fff' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MeetingRooms;
