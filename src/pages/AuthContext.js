import React, { createContext, useState, useEffect } from 'react';

// Create Auth Context
export const AuthContext = createContext();

// AuthProvider component to wrap around App
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate a token verification and check for authentication
  useEffect(() => {
    const token = localStorage.getItem('token'); // Fetch token from local storage
    if (token) {
      setIsAuthenticated(true); // If a token exists, consider user authenticated
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
