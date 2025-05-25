// electionService.js
// A utility service to handle API calls for election management

// Base API URL - replace with your actual API base URL
const API_BASE_URL = '../../config';

// Helper method to get auth token from local storage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Common headers for API requests
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Election API service object
const electionService = {
  // Create a new election
  createElection: async (electionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/elections`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(electionData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create election');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating election:', error);
      throw error;
    }
  },
  
  // Get all elections
  getAllElections: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/elections`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch elections');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  },
  
  // Get election by ID
  getElectionById: async (electionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/election/${electionId}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch election');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching election:', error);
      throw error;
    }
  },
  
  // Update an election
  updateElection: async (electionId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update election');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating election:', error);
      throw error;
    }
  },
  
  // Delete an election
  deleteElection: async (electionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete election');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting election:', error);
      throw error;
    }
  },
  
  // Get election results
  getElectionResults: async (electionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/elections/${electionId}/results`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch election results');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching election results:', error);
      throw error;
    }
  }
};

export default electionService;