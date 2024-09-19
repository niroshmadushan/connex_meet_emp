// src/pages/HomeDashboard.js
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  RadarController,
  PointElement,
  RadialLinearScale,
} from 'chart.js';
import CountUp from 'react-countup';

// Registering the necessary chart.js modules
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
  Legend,
  Title
);

// Updated color themes
const themeColors = {
  primary: '#007aff',
  primaryGradient: 'linear-gradient(90deg, #007aff 0%, #00c6ff 100%)',
  secondary: '#f44336',
  secondaryGradient: 'linear-gradient(90deg, #f44336 0%, #ff4081 100%)',
  cardBg: '#ffffff',
  textPrimary: '#333333',
  chartColors: ['#007aff', '#1e88e5', '#29b6f6', '#4fc3f7'],
  chartHoverColors: ['#005bb5', '#1976d2', '#0288d1', '#039be5'],
  shadow: '0px 4px 20px rgba(0,0,0,0.1)',
};

const HomeDashboard = () => {
  // Data for analytics
  const totalMeetings = 100;
  const successfulMeetings = 75;
  const canceledMeetings = 25;
  const totalSessions = 50;
  const successfulSessions = 40;
  const canceledSessions = 10;
  const totalInterviews = 30;
  const successfulInterviews = 25;
  const canceledInterviews = 5;
  const totalServices = 60;
  const successfulServices = 55;
  const canceledServices = 5;
  const starRatingMeetings = 4.5;
  const starRatingSessions = 4.2;
  const starRatingInterviews = 4.8;
  const starRatingServices = 4.6;

  // Bar chart data for overall success and cancellations
  const barData = {
    labels: ['Meetings', 'Sessions', 'Interviews', 'Services'],
    datasets: [
      {
        label: 'Successful',
        data: [successfulMeetings, successfulSessions, successfulInterviews, successfulServices],
        backgroundColor: themeColors.primary,
        borderColor: themeColors.primaryGradient,
        borderWidth: 2,
        borderRadius: 10,
        barThickness: 30,
        hoverBackgroundColor: '#005bb5',
      },
      {
        label: 'Canceled',
        data: [canceledMeetings, canceledSessions, canceledInterviews, canceledServices],
        backgroundColor: themeColors.secondary,
        borderColor: themeColors.secondaryGradient,
        borderWidth: 2,
        borderRadius: 10,
        barThickness: 30,
        hoverBackgroundColor: '#c62828',
      },
    ],
  };

  // Pie chart data for distribution of meetings
  const pieData = {
    labels: ['Meetings', 'Sessions', 'Interviews', 'Services'],
    datasets: [
      {
        data: [totalMeetings, totalSessions, totalInterviews, totalServices],
        backgroundColor: themeColors.chartColors,
        hoverBackgroundColor: themeColors.chartHoverColors,
        borderWidth: 1,
        hoverOffset: 5,
      },
    ],
  };

  // Line chart data for feedback ratings
  const lineData = {
    labels: ['Meetings', 'Sessions', 'Interviews', 'Services'],
    datasets: [
      {
        label: 'Average Rating',
        data: [starRatingMeetings, starRatingSessions, starRatingInterviews, starRatingServices],
        fill: false,
        backgroundColor: '#ffc107',
        borderColor: '#ffeb3b',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#ffeb3b',
        pointHoverBorderColor: '#ffc107',
      },
    ],
  };

  // Radar chart data for feedback ratings
  const radarData = {
    labels: ['Meetings', 'Sessions', 'Interviews', 'Services'],
    datasets: [
      {
        label: 'Feedback Ratings',
        data: [starRatingMeetings, starRatingSessions, starRatingInterviews, starRatingServices],
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        borderColor: '#007aff',
        pointBackgroundColor: '#007aff',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#007aff',
        borderWidth: 2,
      },
    ],
  };

  // Chart options with animations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
          color: themeColors.textPrimary,
        },
      },
      title: {
        display: false,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
          color: themeColors.textPrimary,
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          color: '#e0e0e0',
        },
        grid: {
          color: '#e0e0e0',
        },
        ticks: {
          display: true,
          font: {
            size: 10,
          },
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
    },
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Analytics Header */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: themeColors.primary, fontFamily: 'Roboto, sans-serif' }}>
        Meeting Analytics Dashboard
      </Typography>

      {/* Overview of Total Counts */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={6} sm={3}>
          <Paper elevation={6} sx={{ padding: '20px', textAlign: 'center', background: themeColors.primaryGradient, color: '#fff', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Total Meetings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <CountUp start={0} end={totalMeetings} duration={2} separator="," />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper elevation={6} sx={{ padding: '20px', textAlign: 'center', background: '#1e88e5', color: '#fff', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Total Sessions</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <CountUp start={0} end={totalSessions} duration={2} separator="," />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper elevation={6} sx={{ padding: '20px', textAlign: 'center', background: '#29b6f6', color: '#fff', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Total Interviews</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <CountUp start={0} end={totalInterviews} duration={2} separator="," />
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper elevation={6} sx={{ padding: '20px', textAlign: 'center', background: '#4fc3f7', color: '#fff', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 'bold' }}>Total Services</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <CountUp start={0} end={totalServices} duration={2} separator="," />
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Bar Chart for Success and Cancellations */}
      <Paper elevation={6} sx={{ padding: '20px', marginBottom: '20px', height: '250px', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
        <Bar data={barData} options={chartOptions} />
      </Paper>

      {/* Pie Chart for Distribution */}
      <Paper elevation={6} sx={{ padding: '20px', marginBottom: '20px', height: '250px', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
        <Pie data={pieData} options={chartOptions} />
      </Paper>

      {/* Line Chart for Ratings */}
      <Paper elevation={6} sx={{ padding: '20px', marginBottom: '20px', height: '250px', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
        <Line data={lineData} options={chartOptions} />
      </Paper>

      {/* Radar Chart for Feedback Comparison */}
      <Paper elevation={6} sx={{ padding: '20px', height: '250px', borderRadius: '12px', animation: 'fadeIn 1.5s' }}>
        <Radar data={radarData} options={radarOptions} />
      </Paper>
    </Box>
  );
};

export default HomeDashboard;
