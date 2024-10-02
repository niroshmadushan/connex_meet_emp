import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper, Divider, Avatar } from '@mui/material';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  RadarController,
  PointElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CancelIcon from '@mui/icons-material/Cancel';
import StarRateIcon from '@mui/icons-material/StarRate';

// Register chart components
ChartJS.register(ArcElement, BarElement, LineElement, RadarController, PointElement, RadialLinearScale, CategoryScale, LinearScale, Tooltip, Legend);

// Carousel settings
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

// Dummy data images for the carousel
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';

// Dashboard Component
const Dashboard = () => {
  // Data for meetings
  const totalMeetings = 150;
  const successfulMeetings = 100;
  const canceledMeetings = 50;
  const averageRating = 4.5;

  // Chart Data
  const barData = {
    labels: ['Meetings'],
    datasets: [
      { label: 'Successful', data: [successfulMeetings], backgroundColor: '#2196f3' },
      { label: 'Canceled', data: [canceledMeetings], backgroundColor: '#f44336' },
    ],
  };

  const pieData = {
    labels: ['Successful', 'Canceled'],
    datasets: [{ data: [successfulMeetings, canceledMeetings], backgroundColor: ['#42a5f5', '#ef5350'] }],
  };

  const lineData = {
    labels: ['Meetings'],
    datasets: [
      {
        label: 'Average Rating',
        data: [averageRating],
        borderColor: '#ffeb3b',
        backgroundColor: 'rgba(255, 235, 59, 0.3)',
        fill: true,
      },
    ],
  };

  const radarData = {
    labels: ['Ratings'],
    datasets: [
      {
        label: 'Feedback Ratings',
        data: [averageRating],
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: '#2196f3',
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <Box sx={{ backgroundColor: '#e3f2fd', minHeight: '100vh', padding: '20px' }}>
      {/* Image Carousel */}
      <Box sx={{ marginBottom: '20px', borderRadius: '15px', overflow: 'hidden' }}>
        <Slider {...sliderSettings}>
          <img src={img1} alt="Carousel 1" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img2} alt="Carousel 2" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img3} alt="Carousel 3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img4} alt="Carousel 4" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        </Slider>
      </Box>

      {/* Header */}
      <Typography variant="h5" sx={{ textAlign: 'center', color: '#1e88e5', fontWeight: 'bold', marginBottom: '20px' }}>
        Meeting Analytics Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ marginBottom: '20px' }}>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ textAlign: 'center', backgroundColor: '#2196f3', color: '#fff', borderRadius: '8px', padding: '20px' }}>
            <MeetingRoomIcon fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="body2">Total Meetings</Typography>
            <Typography variant="h5">
              <CountUp start={0} end={totalMeetings} duration={2.5} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ textAlign: 'center', backgroundColor: '#1e88e5', color: '#fff', borderRadius: '8px', padding: '20px' }}>
            <EventNoteIcon fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="body2">Successful</Typography>
            <Typography variant="h5">
              <CountUp start={0} end={successfulMeetings} duration={2.5} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ textAlign: 'center', backgroundColor: '#e53935', color: '#fff', borderRadius: '8px', padding: '20px' }}>
            <CancelIcon fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="body2">Canceled</Typography>
            <Typography variant="h5">
              <CountUp start={0} end={canceledMeetings} duration={2.5} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ textAlign: 'center', backgroundColor: '#ffeb3b', color: '#000', borderRadius: '8px', padding: '20px' }}>
            <StarRateIcon fontSize="large" sx={{ mb: 1 }} />
            <Typography variant="body2">Average Rating</Typography>
            <Typography variant="h5">
              <CountUp start={0} end={averageRating} decimals={1} duration={2.5} />
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ height: '180px', padding: '10px', borderRadius: '8px' }}>
            <Bar data={barData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ height: '180px', padding: '10px', borderRadius: '8px' }}>
            <Pie data={pieData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ height: '180px', padding: '10px', borderRadius: '8px' }}>
            <Line data={lineData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ height: '180px', padding: '10px', borderRadius: '8px' }}>
            <Radar data={radarData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
