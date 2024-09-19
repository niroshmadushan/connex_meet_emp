// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Light mode for a clean look
    primary: {
      main: '#007aff', // iOS-style blue for primary actions
    },
    secondary: {
      main: '#5856d6', // Purple accent color
    },
    background: {
      default: '#f5f5f7', // Light gray background typical of iOS
      paper: '#ffffff', // White paper for cards and content sections
    },
    text: {
      primary: '#333333', // Dark gray for primary text
      secondary: '#007aff', // Blue for links and secondary actions
    },
  },
  typography: {
    fontFamily: 'San Francisco, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    h6: {
      fontWeight: 500,
      color: '#333333', // Darker text for headers
    },
  },
});

export default theme;
