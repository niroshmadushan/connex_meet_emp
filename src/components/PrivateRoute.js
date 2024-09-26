import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get the JWT token from local storage

  // If token is not available, redirect to login page
  if (!token) {
    return <Navigate to="/connex_meet_emp/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if the token is expired
    if (decodedToken.exp < currentTime) {
      // Token has expired, clear it from localStorage and redirect to login
      localStorage.removeItem('token');
      return <Navigate to="/connex_meet_emp/" />;
    }
  } catch (err) {
    // If decoding fails (e.g., token is invalid), clear token and redirect to login
    localStorage.removeItem('token');
    return <Navigate to="/connex_meet_emp/" />;
  }

  return children;
};

export default PrivateRoute;
