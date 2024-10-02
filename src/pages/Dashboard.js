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

// Import images for the carousel (all imports should be at the top of the file)
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Carousel settings
const sliderSettings = {
  dots: true,
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
    labels: ['Total Meetings', 'Successful Meetings', 'Canceled Meetings'],
    datasets: [
      {
        label: 'Meetings Count',
        data: [totalMeetings, successfulMeetings, canceledMeetings],
        backgroundColor: ['#007aff', '#00c853', '#ff5252'],
        borderColor: ['#005bb5', '#009624', '#ff1744'],
        borderWidth: 2,
      },
    ],
  };

  // Bar chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} Meetings`,
        },
      },
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
    <Box sx={{ backgroundColor: '#e3f2fd', minHeight: '100vh', padding: '20px' }}>
      {/* Top Image Carousel */}
      <Box sx={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '30px' }}>
        <Slider {...sliderSettings}>
          <img src={img1} alt="Image 1" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
          <img src={img2} alt="Image 2" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
          <img src={img3} alt="Image 3" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
          <img src={img4} alt="Image 4" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
        </Slider>
      </Box>

      {/* Meeting Statistics and Bar Chart */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
            <Typography variant="h6" sx={{ color: '#007aff', fontWeight: 'bold' }}>
              Total Meetings
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
              <CountUp start={0} end={totalMeetings} duration={2} />
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
            <Typography variant="h6" sx={{ color: '#00c853', fontWeight: 'bold' }}>
              Successful Meetings
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
              <CountUp start={0} end={successfulMeetings} duration={2} />
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
            <Typography variant="h6" sx={{ color: '#ff5252', fontWeight: 'bold' }}>
              Canceled Meetings
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
              <CountUp start={0} end={canceledMeetings} duration={2} />
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Vertical Bar Chart */}
      <Paper sx={{ height: '300px', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <Typography variant="h6" sx={{ marginBottom: '10px', color: '#333', fontWeight: 'bold' }}>
          Meeting Summary
        </Typography>
        <Bar data={barData} options={chartOptions} />
      </Paper>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', padding: '10px', backgroundColor: '#1e88e5', color: '#fff', borderRadius: '8px' }}>
        <Typography variant="body2">© 2024 Meeting Management App. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
