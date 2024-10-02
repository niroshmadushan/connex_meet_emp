import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { MeetingRoom, CheckCircle, Cancel } from '@mui/icons-material';

// Import images for the carousel
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Carousel settings
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};

const Dashboard = () => {
  // Meeting statistics
  const totalMeetings = 200;
  const successfulMeetings = 150;
  const canceledMeetings = 50;

  // Bar chart data
  const barData = {
    labels: ['Total', 'Successful', 'Canceled'],
    datasets: [
      {
        label: 'Meetings',
        data: [totalMeetings, successfulMeetings, canceledMeetings],
        backgroundColor: '#64b5f6',
        borderColor: '#1e88e5',
        borderWidth: 2,
        barThickness: 16,
        borderRadius: 8,
      },
    ],
  };

  // Bar chart options with animation
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutBounce',
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: '#e0e0e0',
        },
        ticks: {
          beginAtZero: true,
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Box sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '0px', overflow: 'hidden' }}>
      {/* Top Title */}
      <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#007aff', padding: '10px 0' }}>
        Connex Meet
      </Typography>

      {/* Top Image Carousel */}
      <Box sx={{ height: '30vh', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
        <Slider {...sliderSettings}>
          <img src={img1} alt="Image 1" style={{ width: '100%', height: '30vh', objectFit: 'cover' }} />
          <img src={img2} alt="Image 2" style={{ width: '100%', height: '30vh', objectFit: 'cover' }} />
          <img src={img3} alt="Image 3" style={{ width: '100%', height: '30vh', objectFit: 'cover' }} />
          <img src={img4} alt="Image 4" style={{ width: '100%', height: '30vh', objectFit: 'cover' }} />
        </Slider>
      </Box>

      {/* Meeting Statistics - Compact Display */}
      <Grid container spacing={2} sx={{ marginBottom: '10px', justifyContent: 'center' }}>
        <Grid item xs={4}>
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#2196f3',
              color: '#fff',
              borderRadius: '8px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle sx={{ marginRight: '5px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>Total Meetings</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={totalMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#64b5f6',
              color: '#fff',
              borderRadius: '8px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MeetingRoom sx={{ marginRight: '5px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>Successful</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={successfulMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#ff5252',
              color: '#fff',
              borderRadius: '8px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cancel sx={{ marginRight: '5px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>Canceled</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={canceledMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Vertical Bar Chart - Animated */}
      <Paper elevation={0} sx={{ height: '20vh', padding: '10px', borderRadius: '12px', marginBottom: '10px' }}>
        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#007aff', fontWeight: 'bold', textAlign: 'center' }}>
          Meeting Summary
        </Typography>
        <Bar data={barData} options={chartOptions} />
      </Paper>

      {/* App Information Section */}
      <Box sx={{ height: '30vh', padding: '20px', backgroundColor: '#e3f2fd', marginBottom: '10px', borderRadius: '12px', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#007aff', marginBottom: '10px' }}>What You Can Do in This App</Typography>
        <Typography variant="body1" sx={{ color: '#333', marginBottom: '10px' }}>
          Book meetings, view meeting details, check available places, and manage your scheduled events with ease.
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: '#007aff', color: '#fff' }}>Explore Features</Button>
      </Box>

      {/* Footer */}
      <Box sx={{ height: '10vh', textAlign: 'center', padding: '10px', backgroundColor: '#1e88e5', color: '#fff', borderRadius: '8px' }}>
        <Typography variant="body2">© 2024 Meeting Management App. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
