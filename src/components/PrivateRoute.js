import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Correct named import for jwtDecode

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = Cookies.get('token'); // Get the JWT token from cookies

  // If token is not available, redirect to login page
  if (!token) {
    return <Navigate to="/connex_meet_emp/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if the token is expired
    if (decodedToken.exp < currentTime) {
      return <Navigate to="/connex_meet_emp/" />;
    }
  } catch (err) {
    // If decoding fails (e.g., token is invalid), redirect to login
    return <Navigate to="/connex_meet_emp/" />;
  }

  return children;
};

export default PrivateRoute;
