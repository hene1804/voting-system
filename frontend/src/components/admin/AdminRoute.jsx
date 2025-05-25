import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

// This component acts as a route guard for admin-only routes
const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user info from localStorage instead of API call
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          throw new Error('User not found in localStorage');
        }
        
        setIsAdmin(storedUser.role === 'admin');
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsLoading(false);
      }
    };

    verifyAdminStatus();
  }, [token]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Verifying permissions...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/home" replace />;
};

export default AdminRoute;