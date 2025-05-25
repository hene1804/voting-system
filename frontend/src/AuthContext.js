import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: localStorage.getItem('jwtToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const decodedToken = jwtDecode(token); // Use jwtDecode function
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('user');
          setAuthData({ token: null, user: null });
        } else {
          setAuthData({
            token,
            user: JSON.parse(user),
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setAuthData({ token: null, user: null });
      }
    }
  }, []);

  const isAuthenticated = () => {
    return !!authData.token && !!authData.user;
  };

  const login = (userData, token) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthData({ token, user: userData });
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setAuthData({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authData }}>
      {children}
    </AuthContext.Provider>
  );
};
