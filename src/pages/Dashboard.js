import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import Slider from 'react-slick';
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
import CountUp from 'react-countup';

// Image imports for the top slider
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  RadarController,
  PointElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Slider settings for the image carousel
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

// Main dashboard component for meetings
const Dashboard = () => {
  // Sample meeting data
  const totalMeetings = 100;
  const successfulMeetings = 75;
  const canceledMeetings = 25;
  const starRatingMeetings = 4.5;

  // Data for bar, pie, line, and radar charts
  const barData = {
    labels: ['Meetings'],
    datasets: [
      {
        label: 'Successful',
        data: [successfulMeetings],
        backgroundColor: '#007aff',
      },
      {
        label: 'Canceled',
        data: [canceledMeetings],
        backgroundColor: '#f44336',
      },
    ],
  };

  const pieData = {
    labels: ['Successful', 'Canceled'],
    datasets: [
      {
        data: [successfulMeetings, canceledMeetings],
        backgroundColor: ['#007aff', '#f44336'],
      },
    ],
  };

  const lineData = {
    labels: ['Meetings'],
    datasets: [
      {
        label: 'Average Rating',
        data: [starRatingMeetings],
        fill: false,
        borderColor: '#ffeb3b',
      },
    ],
  };

  const radarData = {
    labels: ['Feedback Ratings'],
    datasets: [
      {
        label: 'Ratings',
        data: [starRatingMeetings],
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        borderColor: '#007aff',
      },
    ],
  };

  return (
    <Box
      sx={{
        padding: '15px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto',
        gap: '10px',
      }}
    >
      {/* Image Carousel at the Top */}
      <Box sx={{ width: '100%' }}>
        <Slider {...sliderSettings}>
          <div>
            <img src={img1} alt="Event 1" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          </div>
          <div>
            <img src={img2} alt="Event 2" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          </div>
          <div>
            <img src={img3} alt="Event 3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          </div>
          <div>
            <img src={img4} alt="Event 4" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          </div>
        </Slider>
      </Box>

      {/* Meeting Analytics Title */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'center', color: '#007aff', fontFamily: 'Roboto, sans-serif' }}
      >
        Meeting Analytics
      </Typography>

      {/* Overview of Total Meetings */}
      <Grid container spacing={2} sx={{ textAlign: 'center' }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ padding: '15px', backgroundColor: '#e3f2fd', color: '#007aff', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
              Total Meetings
            </Typography>
            <Typography variant="h5">
              <CountUp start={0} end={totalMeetings} duration={2} separator="," />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ padding: '15px', backgroundColor: '#d1c4e9', color: '#6a1b9a', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
              Successful Meetings
            </Typography>
            <Typography variant="h5">
              <CountUp start={0} end={successfulMeetings} duration={2} separator="," />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ padding: '15px', backgroundColor: '#ffcdd2', color: '#f44336', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
              Canceled Meetings
            </Typography>
            <Typography variant="h5">
              <CountUp start={0} end={canceledMeetings} duration={2} separator="," />
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts for Meeting Data */}
      <Grid container spacing={2}>
        {/* Bar Chart for Success vs Cancellations */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ padding: '10px', height: '200px', borderRadius: '10px' }}>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Paper>
        </Grid>

        {/* Pie Chart for Meeting Distribution */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ padding: '10px', height: '200px', borderRadius: '10px' }}>
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Paper>
        </Grid>

        {/* Line Chart for Ratings */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ padding: '10px', height: '200px', borderRadius: '10px' }}>
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Paper>
        </Grid>

        {/* Radar Chart for Feedback Ratings */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ padding: '10px', height: '200px', borderRadius: '10px' }}>
            <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
