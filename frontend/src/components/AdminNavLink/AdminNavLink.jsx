import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminNavLink = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = storedUser && storedUser.role === 'admin';
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Button 
      component={Link} 
      to="/admin" 
      color="inherit" 
      startIcon={<AdminPanelSettingsIcon />}
      sx={{ 
        marginLeft: 2,
        backgroundColor: '#028391',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#01607a',
        }
      }}
    >
      Admin Panel
    </Button>
  );
};

export default AdminNavLink;