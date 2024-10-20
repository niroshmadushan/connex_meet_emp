import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode
import APIConnection from '../config';

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider component to wrap around App
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate a token verification and check for authentication
  useEffect(() => {
    const token = localStorage.getItem('token'); // Fetch token from local storage

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token is expired, remove it and set isAuthenticated to false
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          // Token is valid, set the user as authenticated
          setIsAuthenticated(true);
        }
      } catch (err) {
        // If the token is invalid, remove it and set isAuthenticated to false
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token); // Set token to local storage on login
    setIsAuthenticated(true); // Update state
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    setIsAuthenticated(false); // Update state
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
