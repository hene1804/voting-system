import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import NavBar from "../../components/AdminNavLink/AdminNavLink";

const AddElection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    electionType: '',
    startDate: null,
    endDate: null
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Election types list - you can modify this based on your needs
  const electionTypes = [
    { value: 'presidential', label: 'Presidential Election' },
    { value: 'parliamentary', label: 'Parliamentary Election' },
    { value: 'local', label: 'Local Election' },
    { value: 'referendum', label: 'Referendum' },
    { value: 'organizational', label: 'Organizational Election' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Validate form data
      if (!formData.title || !formData.description || !formData.electionType || 
          !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields');
      }

      // Check if endDate is after startDate
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        throw new Error('End date must be after start date');
      }

      const response = await axios.post(
        `${API_BASE_URL}/elections`, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAlert({
        open: true,
        message: 'Election created successfully!',
        severity: 'success'
      });

      // Redirect to admin dashboard after successful creation
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating election:', error);
      setAlert({
        open: true,
        message: error.response?.data?.error || error.message || 'Failed to create election',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <div>
      <NavBar />
      
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Create New Election
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Election Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Election Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="election-type-label">Election Type</InputLabel>
                  <Select
                    labelId="election-type-label"
                    id="electionType"
                    name="electionType"
                    value={formData.electionType}
                    onChange={handleChange}
                    label="Election Type"
                  >
                    {electionTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={formData.startDate}
                    onChange={(newValue) => handleDateChange('startDate', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={formData.endDate}
                    onChange={(newValue) => handleDateChange('endDate', newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    minDateTime={formData.startDate}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Election'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddElection;