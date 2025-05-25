import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CssBaseline,
  Container,
  AppBar,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Avatar,
  LinearProgress,
  Button,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { API_BASE_URL } from '../../config';
import NavBar from '../../components/navBar/NavBar';
import './electionResult.scss';

// Utility function to get a random color for the avatar
const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const ElectionResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectionResult = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const electionResponse = await axios.get(`${API_BASE_URL}/election/${id}`, config);
        const electionData = electionResponse.data;
        setElection(electionData);

        const status = getStatus(electionData.startDate, electionData.endDate).text;
        if (status !== 'Ended') {
          navigate('/home');
          return;
        }

        const candidatesResponse = await axios.get(`${API_BASE_URL}/candidates/${id}`, config);
        setCandidates(candidatesResponse.data);

        const resultsResponse = await axios.get(`${API_BASE_URL}/elections/${id}/results`, config);
        setResults(resultsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching election results:', error);
        setLoading(false);
      }
    };

    fetchElectionResult();
  }, [id, navigate]);

  const calculateVotePercentage = (candidateId) => {
    const totalVotes = results.reduce((sum, result) => sum + result.count, 0);
    const candidateVotes = results.find(result => result.candidate === candidateId)?.count || 0;
    return totalVotes > 0 ? ((candidateVotes / totalVotes) * 100).toFixed(2) : 0;
  };

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { text: 'Upcoming', color: 'blue' };
    } else if (now >= start && now <= end) {
      return { text: 'Ongoing', color: 'green' };
    } else {
      return { text: 'Ended', color: 'red' };
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(election.title, 14, 22);
    doc.setFontSize(12);
    doc.text(`Description: ${election.description}`, 14, 30);
    doc.text(`Start Date: ${new Date(election.startDate).toLocaleDateString()}`, 14, 36);
    doc.text(`End Date: ${new Date(election.endDate).toLocaleDateString()}`, 14, 42);
    doc.text('Election Results:', 14, 48);

    const rows = sortedCandidates.map((candidate, index) => [
      index + 1,
      candidate.name,
      candidate.party,
      `${calculateVotePercentage(candidate._id)}%`,
    ]);

    doc.autoTable({
      startY: 55,
      head: [['#', 'Name', 'Party', 'Vote Percentage']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [1, 32, 78] },
      styles: { halign: 'center' },
    });

    doc.save('election_results.pdf');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Sort candidates based on vote percentage in descending order
  const sortedCandidates = candidates.sort((a, b) => calculateVotePercentage(b._id) - calculateVotePercentage(a._id));

  return (
    <div className="electionResultContainer">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container maxWidth="lg" className="electionResultContent">
        {election && (
          <Box mb={4} className="electionInfo">
            <Typography variant="h4" gutterBottom>
              {election.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {election.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Start Date: {new Date(election.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              End Date: {new Date(election.endDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" style={{ color: getStatus(election.startDate, election.endDate).color }}>
              {getStatus(election.startDate, election.endDate).text}
            </Typography>
            <Box mt={0}>
              <Button id="resultPdfButton" type="primary" onClick={downloadPDF}>
                Download Results as PDF
              </Button>
            </Box>
          </Box>
        )}

        <Typography variant="h5" gutterBottom>
          Election Results
        </Typography>
        <Grid container spacing={4}>
          {sortedCandidates.map((candidate) => (
            <Grid item key={candidate._id} xs={12} sm={6} md={4}>
              <Card className="candidateCard">
                <CardContent className="candidateContent">
                  <Avatar style={{ backgroundColor: stringToColor(candidate.name) }}>
                    {candidate.name.charAt(0)}
                  </Avatar>
                  <Box ml={2} flexGrow={1}>
                    <Typography variant="h6">{candidate.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {candidate.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Party: {candidate.party}
                    </Typography>
                  </Box>
                </CardContent>
                <Box px={2} py={1} display="flex" alignItems="center">
                  <Typography variant="h6" color="primary" style={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {calculateVotePercentage(candidate._id)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateVotePercentage(candidate._id)}
                    style={{ width: '70%', height: 10, borderRadius: 5 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ElectionResult;
