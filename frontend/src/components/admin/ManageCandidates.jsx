import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Breadcrumbs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ManageCandidates = () => {
  const { electionId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [election, setElection] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [editingCandidateId, setEditingCandidateId] = useState(null);

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchElection();
    fetchCandidates();
  }, [electionId]);

  const fetchElection = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/elections/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElection(response.data.data);
    } catch (err) {
      setError('Failed to fetch election details');
    }
  };

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/candidates/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
    } catch (err) {
      setError('Failed to fetch candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    
    if (!name || !party) {
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

      // Reset form and refresh candidates
      setName('');
      setParty('');
      setError(null);
      setSuccess('Candidate added successfully');
      setTimeout(() => setSuccess(null), 3000);
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add candidate');
    }
  };

  const handleEditCandidate = (candidate) => {
    setName(candidate.name);
    setParty(candidate.party);
    setEditingCandidateId(candidate._id);
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    
    if (!name || !party) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/candidates/${electionId}/${editingCandidateId}`, {
        name,
        party
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Reset form and refresh candidates
      setName('');
      setParty('');
      setEditingCandidateId(null);
      setError(null);
      setSuccess('Candidate updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update candidate');
    }
  };

  const openDeleteDialog = (candidateId) => {
    setCandidateToDelete(candidateId);
    setConfirmDialogOpen(true);
  };

  const handleDeleteCandidate = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/candidates/${electionId}/${candidateToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Close dialog and refresh candidates
      setConfirmDialogOpen(false);
      setCandidateToDelete(null);
      setSuccess('Candidate deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      fetchCandidates();
    } catch (err) {
      setError('Failed to delete candidate');
      setConfirmDialogOpen(false);
    }
  };

  const cancelEdit = () => {
    setName('');
    setParty('');
    setEditingCandidateId(null);
  };

  if (isLoading && !candidates.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', color: '#1976d2', textDecoration: 'none' }}>
            <ArrowBackIcon sx={{ mr: 0.5, fontSize: 20 }} />
            Back to Elections
          </Link>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" gutterBottom>
          {election ? `Manage Candidates: ${election.title}` : 'Manage Candidates'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Add/Edit Candidate Form */}
        <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#fafafa' }}>
          <Typography variant="h6" gutterBottom>
            {editingCandidateId ? 'Edit Candidate' : 'Add New Candidate'}
          </Typography>
          
          <Box component="form" onSubmit={editingCandidateId ? handleUpdateCandidate : handleAddCandidate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  label="Candidate Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="party"
                  label="Political Party"
                  variant="outlined"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  required
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              {editingCandidateId && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={cancelEdit}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {editingCandidateId ? 'Update Candidate' : 'Add Candidate'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Candidates List */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Current Candidates
        </Typography>
        
        {candidates.length === 0 ? (
          <Typography color="textSecondary">No candidates added yet.</Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><Typography variant="subtitle2">Name</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Party</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate._id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.party}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        color="primary"
                        onClick={() => handleEditCandidate(candidate)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(candidate._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this candidate? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCandidate} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageCandidates;