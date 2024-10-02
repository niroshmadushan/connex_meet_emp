import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { MeetingRoom, CheckCircle, Cancel, EventAvailable, Info, Book } from '@mui/icons-material';
import Slider from 'react-slick';
import CountUp from 'react-countup';

// Import images for the carousel
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';

// Slider settings for smooth transitions
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

  return (
    <Box sx={{ backgroundColor: '#f7f9fc', minHeight: '80vh', padding: '10px', fontFamily: 'Roboto, sans-serif' }}>
      {/* Page Title */}
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          marginBottom: '10px',
          fontWeight: 'bold',
          color: '#007aff',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        Connex Meet
      </Typography>

      {/* Image Carousel */}
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

      {/* Meeting Statistics Section */}
      <Grid
        container
        spacing={1}
        sx={{
          marginBottom: '15px',
          justifyContent: 'space-between',
          padding: '10px',
        }}
      >
        <Grid item xs={4}>
          <Box
            sx={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#e3f2fd',
              color: '#007aff',
              borderRadius: '10px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-4px)'},
            }}
          >
            <CheckCircle sx={{ marginRight: '4px', fontSize: '20px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                Meetings
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                <CountUp start={0} end={totalMeetings} duration={2} />
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#cce4ff',
              color: '#1e88e5',
              borderRadius: '10px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-4px)'},
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
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#ffcdd2',
              color: '#ff5252',
              borderRadius: '10px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'translateY(-4px)' },
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
          </Box>
        </Grid>
      </Grid>

      {/* Feature Information */}
      <Box
        sx={{
          textAlign: 'center',
          padding: '15px',
          backgroundColor: '#f0f4ff',
          color: '#007aff',
          borderRadius: '10px',
          marginBottom: '15px',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>
          What You Can Do In This App
        </Typography>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            <EventAvailable sx={{ fontSize: '16px', color: '#2196f3' }} /> Book and manage meetings.
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            <Info sx={{ fontSize: '16px', color: '#64b5f6' }} /> View available rooms and schedules.
          </Typography>
          <Typography variant="body2">
            <Book sx={{ fontSize: '16px', color: '#ff5252' }} /> Track meeting details and participants.
          </Typography>
        </Box>
      </Box>

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
