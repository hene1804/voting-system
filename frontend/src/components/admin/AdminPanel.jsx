import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';
import NavBar from "../../components/AdminNavLink/AdminNavLink";
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        // Check if user is admin
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || storedUser.role !== 'admin') {
          navigate('/home');
          return;
        }
        
        setIsAdmin(true);
        
        // Fetch elections
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${API_BASE_URL}/elections`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setElections(response.data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAndFetchData();
  }, [navigate]);
  
  // Function to format date in a readable way
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to determine election status
  const getElectionStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { label: 'Upcoming', color: 'warning' };
    } else if (now > end) {
      return { label: 'Completed', color: 'default' };
    } else {
      return { label: 'Active', color: 'success' };
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {/* <Grid item>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/admin/elections/add"
                startIcon={<AddIcon />}
                sx={{ mr: 2 }}
              >
                Add New Election
              </Button>
            </Grid> */}
            <Grid item>
              <Button 
                variant="contained" 
                color="secondary" 
                component={Link} 
                to="/admin/candidates/add"
                startIcon={<PersonAddIcon />}
              >
                Add New Candidate
              </Button>
            </Grid>
            {/* Add other admin actions here */}
          </Grid>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Manage Elections
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            component={Link} 
            to="/admin/elections/add"
            startIcon={<EventIcon />}
          >
            Create Election
          </Button>
        </Box>
        
        {elections.length === 0 ? (
          <Box sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            textAlign: 'center',
            border: '1px dashed grey'
          }}>
            <Typography variant="h6" color="text.secondary">
              No elections found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Create your first election to get started
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/admin/elections/add"
              startIcon={<AddIcon />}
            >
              Create New Election
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {elections?.map((election) => {
              const status = getElectionStatus(election.startDate, election.endDate);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={election._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2">
                          {election.title}
                        </Typography>
                        <Chip 
                          label={status.label} 
                          color={status.color} 
                          size="small" 
                        />
                      </Box>
                      
                      {/* {election.electionType && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Type: {election.electionType.charAt(0).toUpperCase() + election.electionType.slice(1)}
                        </Typography>
                      )}
                       */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {election.description?.substring(0, 100)}
                        {election.description?.length > 100 ? '...' : ''}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        <strong>Start:</strong> {formatDate(election.startDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>End:</strong> {formatDate(election.endDate)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary" 
                        component={Link} 
                        to={`/admin/elections/${election._id}/edit`}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="primary" 
                        component={Link} 
                        to={`/admin/elections/${election._id}/candidates`}
                      >
                        Manage Candidates
                      </Button>
                      <Button 
                        size="small" 
                        color="primary" 
                        component={Link} 
                        to={`/admin/elections/${election._id}/results`}
                      >
                        Results
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default AdminPanel;