import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';
import { MeetingRoom, CheckCircle, Cancel, EventAvailable, Info, Book } from '@mui/icons-material';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import APIConnection from '../config';
// Import images for the carousel
import img1 from '../img/img1.webp';
import img2 from '../img/img2.jpg';
import img3 from '../img/img3.jpg';
import img4 from '../img/img4.png';

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
  // State variables to hold meeting statistics
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [canceledMeetings, setCanceledMeetings] = useState(0);
  const [successfulMeetings, setSuccessfulMeetings] = useState(0);

  useEffect(() => {
    // Retrieve empId from local storage
    const empId = localStorage.getItem('id');

    // Fetch total meetings
    axios.get(`${APIConnection.mainapi}/getbookingcount/${empId}`, { withCredentials: true })
      .then((response) => {
        const total = response.data[0]?.totalbookings || 0;
        setTotalMeetings(total);
        
      })
      .catch((error) => {
        console.error("Error fetching total meetings:", error);
      });

    // Fetch canceled meetings
    axios.get(`${APIConnection.mainapi}/getcancelbookingcount/${empId}`, { withCredentials: true })
      .then((response) => {
        const canceled = response.data[0]?.totalcanceldbookings || 0;
        setCanceledMeetings(canceled);

        // Calculate successful meetings
        
      })
      .catch((error) => {
        console.error("Error fetching canceled meetings:", error);
      });

      axios.get(`${APIConnection.mainapi}/getsuccessfulbookingcount/${empId}`, { withCredentials: true })
      .then((response) => {
        const total = response.data[0]?.totalsuccessfulbookings || 0;
        setSuccessfulMeetings(total);

        // Calculate successful meetings
        
      })
      .catch((error) => {
        console.error("Error fetching Successfull meetings:", error);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f7f9fc', minHeight: '80vh',width:'60vh', padding: '10px',borderRadius:'10px', fontFamily: 'Roboto, sans-serif',m:'auto',mt:8 }}>
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
          <img src={img1} alt="Image 1" style={{ width: '100%', height: '25vh', objectFit: 'cover' }} />
          <img src={img2} alt="Image 2" style={{ width: '100%', height: '25vh', objectFit: 'cover' }} />
          <img src={img3} alt="Image 3" style={{ width: '100%', height: '25vh', objectFit: 'cover' }} />
          <img src={img4} alt="Image 4" style={{ width: '100%', height: '25vh', objectFit: 'cover' }} />
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
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CheckCircle sx={{ marginRight: '4px', fontSize: '20px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>Meetings</Typography>
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
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <MeetingRoom sx={{ marginRight: '4px', fontSize: '20px' }} />
            <Box>
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>Successful</Typography>
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
              <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold' }}>Canceled</Typography>
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
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '5px' }}>What You Can Do In This App</Typography>
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
