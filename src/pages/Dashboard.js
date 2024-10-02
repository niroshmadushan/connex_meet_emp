import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import {
  Chart as ChartJS,
  ArcElement,
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
ChartJS.register(ArcElement, Tooltip, Legend);

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

  // Donut chart data
  const donutData = {
    labels: ['Total Meetings', 'Successful Meetings', 'Canceled Meetings'],
    datasets: [
      {
        data: [totalMeetings, successfulMeetings, canceledMeetings],
        backgroundColor: ['#64b5f6', '#2196f3', '#ff5252'],
        hoverBackgroundColor: ['#42a5f5', '#1e88e5', '#ff1744'],
        borderWidth: 4,
        cutout: '70%',
      },
    ],
  };

  return (
    <Box sx={{ backgroundColor: '#f7f9fc', minHeight: '100vh', padding: '20px' }}>
      {/* Top Title */}
      <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#007aff', paddingBottom: '20px', fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
        Connex Meet
      </Typography>

      {/* Top Image Carousel */}
      <Box sx={{ height: '30vh', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
        <Slider {...sliderSettings}>
          <img src={img1} alt="Image 1" style={{ width: '100%', height: '30vh', objectFit: 'cover', borderRadius: '12px' }} />
          <img src={img2} alt="Image 2" style={{ width: '100%', height: '30vh', objectFit: 'cover', borderRadius: '12px' }} />
          <img src={img3} alt="Image 3" style={{ width: '100%', height: '30vh', objectFit: 'cover', borderRadius: '12px' }} />
          <img src={img4} alt="Image 4" style={{ width: '100%', height: '30vh', objectFit: 'cover', borderRadius: '12px' }} />
        </Slider>
      </Box>

      {/* Meeting Statistics - Compact Display */}
      <Grid container spacing={3} sx={{ marginBottom: '30px', justifyContent: 'center' }}>
        <Grid item xs={4}>
          <Paper
            elevation={3}
            sx={{
              textAlign: 'center',
              padding: '15px',
              backgroundColor: '#f0f4ff',
              color: '#007aff',
              borderRadius: '12px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle sx={{ marginRight: '5px', fontSize: '30px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Total Meetings</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={totalMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            elevation={3}
            sx={{
              textAlign: 'center',
              padding: '15px',
              backgroundColor: '#e3f2fd',
              color: '#1e88e5',
              borderRadius: '12px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MeetingRoom sx={{ marginRight: '5px', fontSize: '30px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Successful Meetings</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={successfulMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            elevation={3}
            sx={{
              textAlign: 'center',
              padding: '15px',
              backgroundColor: '#ffebee',
              color: '#ff5252',
              borderRadius: '12px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cancel sx={{ marginRight: '5px', fontSize: '30px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Canceled Meetings</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={canceledMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Donut Chart */}
      <Paper elevation={3} sx={{ height: '30vh', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
        <Typography variant="h6" sx={{ marginBottom: '20px', color: '#007aff', fontWeight: 'bold', textAlign: 'center' }}>
          Meeting Overview
        </Typography>
        <Doughnut data={donutData} />
      </Paper>

      {/* App Information Section */}
      <Box sx={{ height: '20vh', padding: '30px', backgroundColor: '#f0f4ff', marginBottom: '20px', borderRadius: '12px', textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007aff', marginBottom: '20px' }}>What You Can Do in This App</Typography>
        <Typography variant="body1" sx={{ color: '#333', marginBottom: '10px' }}>
          Book meetings, view meeting details, check available places, and manage your scheduled events with ease.
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ height: '8vh', textAlign: 'center', padding: '20px', backgroundColor: '#e3f2fd', color: '#007aff', borderRadius: '12px' }}>
        <Typography variant="body2">© 2024 Connex Meet App. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
