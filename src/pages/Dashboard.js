import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
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
        backgroundColor: ['#007aff', '#00c853', '#ff5252'],
        borderColor: ['#005bb5', '#009624', '#ff1744'],
        borderWidth: 2,
        barThickness: 12, // Thin bars
        borderRadius: 10,
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
    <Box sx={{ backgroundColor: '#e3f2fd', minHeight: '100vh', padding: '20px', overflow: 'hidden' }}>
      {/* Top Image Carousel */}
      <Box sx={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Slider {...sliderSettings}>
          <img src={img1} alt="Image 1" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img2} alt="Image 2" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img3} alt="Image 3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img4} alt="Image 4" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        </Slider>
      </Box>

      {/* Meeting Statistics - Compact Display */}
      <Grid container spacing={2} sx={{ marginBottom: '20px', justifyContent: 'center' }}>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ textAlign: 'center', padding: '10px', backgroundColor: '#007aff', color: '#fff', borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Total Meetings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <CountUp start={0} end={totalMeetings} duration={2} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ textAlign: 'center', padding: '10px', backgroundColor: '#00c853', color: '#fff', borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Successful</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <CountUp start={0} end={successfulMeetings} duration={2} />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ textAlign: 'center', padding: '10px', backgroundColor: '#ff5252', color: '#fff', borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Canceled</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <CountUp start={0} end={canceledMeetings} duration={2} />
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Vertical Bar Chart - Animated */}
      <Paper elevation={3} sx={{ height: '300px', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#007aff', fontWeight: 'bold', textAlign: 'center' }}>
          Meeting Summary
        </Typography>
        <Bar data={barData} options={chartOptions} />
      </Paper>

      {/* App Information */}
      <Box sx={{ padding: '20px', backgroundColor: '#e3f2fd', marginBottom: '20px', borderRadius: '12px', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#007aff', marginBottom: '10px' }}>What You Can Do in This App</Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          You can book meetings, view meeting details, check available places, and manage your scheduled events with ease.
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: '#007aff', color: '#fff', mt: 2 }}>Explore Features</Button>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', padding: '10px', backgroundColor: '#1e88e5', color: '#fff', borderRadius: '8px' }}>
        <Typography variant="body2">© 2024 Meeting Management App. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
