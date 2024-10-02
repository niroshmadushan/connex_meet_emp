import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
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

// Import images for the carousel
import img1 from '../img/about-us-page-examples-1-61fd8f9784626-sej.webp';
import img2 from '../img/find-company-information-image.jpg';
import img3 from '../img/Mobile Bank.jpg';
import img4 from '../img/Microsoft.jpg';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, LineElement, RadarController, PointElement, RadialLinearScale, CategoryScale, LinearScale, Tooltip, Legend);

// Slider settings for the image carousel
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const Dashboard = () => {
  // Data for meetings
  const totalMeetings = 150;
  const successfulMeetings = 100;
  const canceledMeetings = 50;
  const starRatingMeetings = 4.5;

  // Chart data configurations
  const barData = {
    labels: ['Meetings'],
    datasets: [
      { label: 'Successful', data: [successfulMeetings], backgroundColor: '#4caf50' },
      { label: 'Canceled', data: [canceledMeetings], backgroundColor: '#f44336' },
    ],
  };

  const pieData = {
    labels: ['Successful', 'Canceled'],
    datasets: [{ data: [successfulMeetings, canceledMeetings], backgroundColor: ['#4caf50', '#f44336'] }],
  };

  const lineData = {
    labels: ['Meetings'],
    datasets: [
      {
        label: 'Average Rating',
        data: [starRatingMeetings],
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
        data: [starRatingMeetings],
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        borderColor: '#007aff',
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      {/* Image Carousel */}
      <Box sx={{ marginBottom: '20px', borderRadius: '15px', overflow: 'hidden' }}>
        <Slider {...sliderSettings}>
          <img src={img1} alt="Carousel 1" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img2} alt="Carousel 2" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img3} alt="Carousel 3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <img src={img4} alt="Carousel 4" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        </Slider>
      </Box>

      {/* Header Title */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#007aff', marginBottom: '20px' }}>
        Meeting Analytics Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={6}>
          <Card sx={{ backgroundColor: '#4caf50', color: '#fff', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="body2">Total Meetings</Typography>
              <Typography variant="h5">
                <CountUp start={0} end={totalMeetings} duration={2} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ backgroundColor: '#1e88e5', color: '#fff', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="body2">Successful</Typography>
              <Typography variant="h5">
                <CountUp start={0} end={successfulMeetings} duration={2} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ backgroundColor: '#e53935', color: '#fff', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="body2">Canceled</Typography>
              <Typography variant="h5">
                <CountUp start={0} end={canceledMeetings} duration={2} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ backgroundColor: '#ffc107', color: '#fff', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="body2">Average Rating</Typography>
              <Typography variant="h5">
                <CountUp start={0} end={starRatingMeetings} decimals={1} duration={2} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ height: '180px', padding: '10px' }}>
            <Bar data={barData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ height: '180px', padding: '10px' }}>
            <Pie data={pieData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ height: '180px', padding: '10px' }}>
            <Line data={lineData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper elevation={0} sx={{ height: '180px', padding: '10px' }}>
            <Radar data={radarData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
