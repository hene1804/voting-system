import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
} from "@mui/material";
import { Statistic } from "antd";
import { API_BASE_URL } from "../../config";
import NavBar from "../../components/navBar/NavBar";
import "./electionDetails.scss";

// Utility function to get a random color for the avatar
const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

// Helper function to determine election status
const getElectionStatus = (startDate, endDate) => {
  // Ensure we have valid dates
  if (!startDate || !endDate) {
    console.error("Missing date values:", { startDate, endDate });
    return { text: "", color: "", time: null };
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Invalid date objects:", { start, end });
    return { text: "", color: "", time: null };
  }

  if (now < start) {
    return { text: "Upcoming", color: "blue", time: start };
  } else if (now >= start && now <= end) {
    return { text: "Ongoing", color: "green", time: end };
  } else {
    return { text: "Ended", color: "red", time: null };
  }
};

// Improved date formatter with better error handling
const formatDate = (dateString) => {
  if (!dateString) {
    console.error("No date string provided");
    return "Not available";
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "Invalid Date";
    }
    
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date Error";
  }
};

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [electionStatus, setElectionStatus] = useState({ text: "", color: "", time: null });

  useEffect(() => {
    const fetchElectionDetails = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No JWT token found");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const electionResponse = await axios.get(
          `${API_BASE_URL}/election/${id}`,
          config
        );
        
        // Handle different API response structures
        const electionData = electionResponse.data.data || electionResponse.data;
        
        // Verify the date fields exist
        if (!electionData.startDate || !electionData.endDate) {
          console.error("Missing date fields in API response", electionData);
          setSnackbarMessage("Error: Missing date information for this election");
          setSnackbarColor("red");
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
        
        // Log the date strings to help with debugging
        console.log("Start date from API:", electionData.startDate);
        console.log("End date from API:", electionData.endDate);

        // Calculate status after we have the election data
        const status = getElectionStatus(electionData.startDate, electionData.endDate);
        setElectionStatus(status);

        if (status.text === "") {
          console.error("Could not determine election status");
          setSnackbarMessage("Error: Could not determine election status");
          setSnackbarColor("red");
          setSnackbarOpen(true);
          setLoading(false);
          return;
        } 
        
        setElection(electionData);

        try {
          const candidatesResponse = await axios.get(
            `${API_BASE_URL}/candidates/${id}`,
            config
          );
          // Handle different API response structures
          const candidatesData = candidatesResponse.data.data || candidatesResponse.data;
          setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
        } catch (candidateError) {
          console.error("Error fetching candidates:", candidateError);
          setSnackbarMessage("Error loading candidates data");
          setSnackbarColor("red");
          setSnackbarOpen(true);
          setCandidates([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching election details:", error);
        setSnackbarMessage("Error loading election data");
        setSnackbarColor("red");
        setSnackbarOpen(true);
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [id, navigate]);

  const handleVote = (candidate) => {
    setSelectedCandidate(candidate);
    setDialogOpen(true);
  };

  const handleConfirmVote = async () => {
    if (candidateName !== selectedCandidate.name) {
      setSnackbarMessage("Candidate name does not match.");
      setSnackbarColor("red");
      setSnackbarOpen(true);
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/votes`,
        { election: id, candidate: selectedCandidate._id },
        config
      );
      setSnackbarMessage(response.data.message || "Vote recorded successfully");
      setSnackbarColor("green");
      setCandidateName("");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error recording your vote";
      setSnackbarMessage(errorMessage);
      setSnackbarColor("red");
      setCandidateName("");
    }

    setDialogOpen(false);
    setSnackbarOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCandidateName("");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const countdownText =
    electionStatus.text === "Upcoming"
      ? "Election starts in:"
      : electionStatus.text === "Ongoing"
      ? "Election ends in:"
      : "Election ended";

  return (
    <div className="electionDetailsContainer">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container maxWidth="lg" className="electionDetailsContent">
        {election && (
          <Box mb={4} className="electionInfo">
            <Typography variant="h4" gutterBottom>
              {election.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {election.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Start Date: {formatDate(election.startDate)}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              End Date: {formatDate(election.endDate)}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Status: <span style={{ color: electionStatus.color, fontWeight: "bold" }}>{electionStatus.text}</span>
            </Typography>
            {electionStatus.time && (
              <Box mt={2}>
                <Typography
                  variant="body1"
                  style={{ color: electionStatus.color }}
                  gutterBottom
                >
                  {countdownText}
                </Typography>
                <Statistic.Countdown
                  value={electionStatus.time}
                  format="D[d] H[h] m[m] s[s]"
                  valueStyle={{
                    color: electionStatus.color,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        <Typography variant="h5" gutterBottom>
          Candidates
        </Typography>
        {candidates && candidates.length > 0 ? (
          <Grid container spacing={4}>
            {candidates.map((candidate) => (
              <Grid item key={candidate._id} xs={12} sm={6} md={4}>
                <Card className="candidateCard">
                  <CardContent className="candidateContent">
                    <Avatar
                      style={{
                        backgroundColor: stringToColor(candidate.name),
                        width: 60,
                        height: 60,
                        fontSize: "1.5rem",
                      }}
                    >
                      {candidate.name.charAt(0)}
                    </Avatar>
                    <Box ml={2} flexGrow={1}>
                      <Typography variant="h6">{candidate.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {candidate.description || "No description available"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Party: {candidate.party || "Not specified"}
                      </Typography>
                    </Box>
                    {electionStatus.text === "Ongoing" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleVote(candidate)}
                        className="voteButton"
                        style={{ marginTop: "10px" }}
                      >
                        Vote
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary" style={{ marginTop: "20px" }}>
            No candidates available for this election.
          </Typography>
        )}
      </Container>

      {/* Vote Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Your Vote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type the candidate's name to confirm your vote for{" "}
            <span style={{ fontWeight: "bold", color: "#2563eb", textDecoration: "underline" }}>
  {selectedCandidate?.name}
</span>.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Candidate Name"
            fullWidth
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmVote} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        ContentProps={{
          style: {
            backgroundColor: snackbarColor,
          },
        }}
      />
    </div>
  );
};

export default ElectionDetails;