import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

const AdminCandidateForm = () => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [electionId, setElectionId] = useState('');
  const [elections, setElections] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Get the token from localStorage
  const token = localStorage.getItem('jwtToken');

  // Check if user is admin on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      try {
        // Get user from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (!storedUser) {
          throw new Error('User not found');
        }

        if (storedUser.role === 'admin') {
          setIsAdmin(true);
          // Fetch elections for dropdown
          fetchElections();
        } else {
          // Redirect non-admin users
          navigate('/home');
        }
      } catch (err) {
        setError('Failed to authenticate. Please login again.');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  // Fetch elections for the dropdown
  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/elections`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setElections(response.data.data);
      
      // Set default election ID if elections exist
      if (response.data.data.length > 0) {
        setElectionId(response.data.data[0]._id);
      }
    } catch (err) {
      setError('Failed to fetch elections');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !party || !electionId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/candidates/${electionId}`, {
        name,
        party
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Reset form
      setName('');
      setParty('');
      setError(null);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add candidate');
    }
  };

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not admin, this will redirect via useEffect, but adding this check as well
  if (!isAdmin) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3}
        sx={{ 
          mt: 8, 
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Add New Candidate
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Candidate added successfully!
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="election-label">Election</InputLabel>
            <Select
              labelId="election-label"
              id="election"
              value={electionId}
              label="Election"
              onChange={(e) => setElectionId(e.target.value)}
              required
            >
              {elections?.map((election) => (
                <MenuItem key={election._id} value={election._id}>
                  {election.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Candidate Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="party"
            label="Political Party"
            name="party"
            value={party}
            onChange={(e) => setParty(e.target.value)}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Candidate
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminCandidateForm;