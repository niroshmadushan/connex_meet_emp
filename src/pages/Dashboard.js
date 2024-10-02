import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, CircularProgress, Avatar, IconButton } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import CountUp from 'react-countup';
import Slider from 'react-slick';
import PlaceIcon from '@mui/icons-material/Place';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const DashboardMeetingApp = () => {
  // Example state for meeting data
  const [availableRooms, setAvailableRooms] = useState([
    { id: 1, name: 'Conference Room A', status: 'Available', location: 'Building 1', capacity: 15 },
    { id: 2, name: 'Board Room B', status: 'Booked', location: 'Building 3', capacity: 10 },
    { id: 3, name: 'Meeting Room C', status: 'Available', location: 'Building 2', capacity: 8 },
  ]);

  const [upcomingMeetings, setUpcomingMeetings] = useState([
    { id: 1, title: 'Project Review', date: '10/04/2024', time: '2:00 PM - 3:30 PM', place: 'Conference Room A' },
    { id: 2, title: 'Client Presentation', date: '10/04/2024', time: '4:00 PM - 5:00 PM', place: 'Meeting Room C' },
  ]);

  const totalAvailable = availableRooms.filter((room) => room.status === 'Available').length;

  // Chart data for room usage
  const barData = {
    labels: availableRooms.map((room) => room.name),
    datasets: [
      {
        label: 'Room Capacity',
        data: availableRooms.map((room) => room.capacity),
        backgroundColor: '#007aff',
        borderColor: '#005bb5',
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  // Chart data for upcoming meetings
  const doughnutData = {
    labels: upcomingMeetings.map((meeting) => meeting.title),
    datasets: [
      {
        label: 'Upcoming Meetings',
        data: upcomingMeetings.map((_, index) => (index + 1) * 20), // Mock data for display
        backgroundColor: ['#007aff', '#1e88e5', '#29b6f6', '#4fc3f7'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007aff' }}>
          Meeting Booking Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Manage and track your meetings efficiently
        </Typography>
      </Box>

      {/* Room Availability Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#007aff', mb: 2 }}>
          Available Rooms ({totalAvailable})
        </Typography>
        <Grid container spacing={2}>
          {availableRooms.map((room) => (
            <Grid item xs={12} sm={4} key={room.id}>
              <Paper elevation={0} sx={{ padding: '10px', border: `2px solid ${room.status === 'Available' ? '#4caf50' : '#f44336'}`, borderRadius: '8px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: room.status === 'Available' ? '#4caf50' : '#f44336' }}>
                  {room.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  <PlaceIcon fontSize="small" sx={{ mr: 1 }} />
                  {room.location}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  <MeetingRoomIcon fontSize="small" sx={{ mr: 1 }} />
                  Capacity: {room.capacity}
                </Typography>
                <Button variant="outlined" sx={{ mt: 1 }} startIcon={room.status === 'Available' ? <CheckCircleIcon /> : <CloseIcon />}>
                  {room.status}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Upcoming Meetings Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#007aff', mb: 2 }}>
          Upcoming Meetings
        </Typography>
        <Grid container spacing={2}>
          {upcomingMeetings.map((meeting) => (
            <Grid item xs={12} sm={6} key={meeting.id}>
              <Paper elevation={0} sx={{ padding: '10px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {meeting.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
                  {meeting.date}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                  {meeting.time}
                </Typography>
                <Typography variant="body2" sx={{ color: '#007aff' }}>
                  <MeetingRoomIcon fontSize="small" sx={{ mr: 1 }} />
                  {meeting.place}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bar Chart for Room Capacity */}
      <Box sx={{ height: '200px', mb: 3 }}>
        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>

      {/* Doughnut Chart for Upcoming Meetings */}
      <Box sx={{ height: '200px' }}>
        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>
    </Box>
  );
};

export default DashboardMeetingApp;
