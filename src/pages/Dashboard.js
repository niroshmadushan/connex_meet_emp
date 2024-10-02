import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import { MeetingRoom, CheckCircle, Cancel, Info, Book, EventAvailable } from '@mui/icons-material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Import images for the carousel
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Carousel settings for smooth transitions
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
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
        borderWidth: 3,
        cutout: '70%',
      },
    ],
  };

  return (
    <Box sx={{ backgroundColor: '#f7f9fc', minHeight: '80vh', padding: '10px' }}>
      {/* Top Image Carousel */}
      <Box
        sx={{
          height: '25vh',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '15px',
        }}
      >
        <Slider {...sliderSettings}>
          <img
            src={img1}
            alt="Image 1"
            style={{ width: '100%', height: '25vh', objectFit: 'cover' }}
          />
          <img
            src={img2}
            alt="Image 2"
            style={{ width: '100%', height: '25vh', objectFit: 'cover' }}
          />
          <img
            src={img3}
            alt="Image 3"
            style={{ width: '100%', height: '25vh', objectFit: 'cover' }}
          />
          <img
            src={img4}
            alt="Image 4"
            style={{ width: '100%', height: '25vh', objectFit: 'cover' }}
          />
        </Slider>
      </Box>

      {/* Meeting Statistics - Compact Display */}
      <Grid
        container
        spacing={1}
        sx={{
          marginBottom: '15px',
          justifyContent: 'space-between',
        }}
      >
        <Grid item xs={4}>
          <Paper
            sx={{
              textAlign: 'center',
              padding: '5px',
              backgroundColor: '#f0f4ff',
              color: '#007aff',
              borderRadius: '10px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle sx={{ marginRight: '4px', fontSize: '20px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                Total Meetings
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={totalMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              textAlign: 'center',
              padding: '5px',
              backgroundColor: '#e3f2fd',
              color: '#1e88e5',
              borderRadius: '10px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MeetingRoom sx={{ marginRight: '4px', fontSize: '20px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                Successful
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={successfulMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              textAlign: 'center',
              padding: '5px',
              backgroundColor: '#ffebee',
              color: '#ff5252',
              borderRadius: '10px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cancel sx={{ marginRight: '4px', fontSize: '20px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                Canceled
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={canceledMeetings} duration={2} />
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Meeting Overview */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '20vh',
          marginBottom: '15px',
        }}
      >
        {/* Information Section */}
        <Box
          sx={{
            width: '30%',
            padding: '10px',
            backgroundColor: '#e3f2fd',
            borderRadius: '10px',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#007aff' }}>
            Meeting Overview:
          </Typography>
          <Typography variant="body2" sx={{ color: '#007aff', fontWeight: 'bold' }}>
            Total: {totalMeetings}
          </Typography>
          <Typography variant="body2" sx={{ color: '#1e88e5' }}>
            Successful: {successfulMeetings}
          </Typography>
          <Typography variant="body2" sx={{ color: '#ff5252' }}>
            Canceled: {canceledMeetings}
          </Typography>
        </Box>

        {/* Donut Chart */}
        <Box
          sx={{
            width: '70%',
            backgroundColor: '#f7f9fc',
            padding: '10px',
            borderRadius: '10px',
          }}
        >
          <Doughnut data={donutData} />
        </Box>
      </Box>

      {/* Feature Information */}
      <Paper
        elevation={3}
        sx={{
          textAlign: 'center',
          padding: '10px',
          backgroundColor: '#f0f4ff',
          color: '#007aff',
          borderRadius: '10px',
          marginBottom: '15px',
          height: '20vh',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
          What You Can Do In This App
        </Typography>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" sx={{ marginBottom: '4px' }}>
            <EventAvailable sx={{ fontSize: '16px', color: '#2196f3' }} /> Book and manage meetings.
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '4px' }}>
            <Info sx={{ fontSize: '16px', color: '#64b5f6' }} /> View available rooms and schedules.
          </Typography>
          <Typography variant="body2">
            <Book sx={{ fontSize: '16px', color: '#ff5252' }} /> Track meeting details and participants.
          </Typography>
        </Box>
      </Paper>

      {/* Footer */}
      <Box
        sx={{
          height: '5vh',
          textAlign: 'center',
          padding: '5px',
          backgroundColor: '#e3f2fd',
          color: '#007aff',
          borderRadius: '10px',
        }}
      >
        <Typography variant="body2">© 2024 Connex Meet. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
