import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Typography,
  Button,
  Container,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';
import axios from 'axios';
import './home.scss';
import { API_BASE_URL } from '../../config';
import { HowToVote as HowToVoteIcon } from '@mui/icons-material';
import { Input, DatePicker, Button as AntButton, Form, Row, Col } from 'antd';
import NavBar from "../../components/navBar/NavBar";

const Home = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [allElections, setAllElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterDate, setFilterDate] = useState(null);

  console.log(elections, "elections")
  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/elections`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setElections(response.data.data);
          setAllElections(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching elections:', error);
          setLoading(false);
        }
      }
    };

    fetchElections();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
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

  const handleApplyFilters = () => {
    const filteredElections = allElections.filter((election) => {
      const matchesTitle = filterTitle ? election.title.toLowerCase().includes(filterTitle.toLowerCase()) : true;
      const matchesDate = filterDate ? formatDate(election.startDate) === filterDate : true;
      return matchesTitle && matchesDate;
    });
    setElections(filteredElections);
  };

  return (
    <div className="home-container">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container className="home-content" maxWidth="lg">
        <div className="home-content-welcome">
          <Typography variant="h4" className="welcome-message home-content-welcome-title" gutterBottom>
            Welcome to mmu-evotinge!
          </Typography>
          <Typography variant="body1" className="info-message home-content-welcome-des" gutterBottom>
            Empowering your voice in democracy with secure, informed, and engaging voting.
          </Typography>
        </div>

        {/* Filter Section */}
        <Paper elevation={3} style={{ padding: '24px', marginBottom: '100px' }}>
          <Typography variant="h6" gutterBottom>
            Filter Elections
          </Typography>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Date">
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={(date, dateString) => setFilterDate(dateString)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Title">
                  <Input
                    placeholder="Enter election title"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <AntButton
                    type="primary"
                    onClick={handleApplyFilters}
                    block
                    style={{ marginTop: '30px', background:"#028391", color:"#01204E", fontWeight:"bold", fontSize:"1rem" }}
                    className='applyFiltersButton'
                  >
                    Apply Filters
                  </AntButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Paper>

        <Typography variant="h5" className="elections-title" gutterBottom>
          <HowToVoteIcon /> Elections
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {elections?.map(election => (
              <Grid item key={election._id} xs={12} sm={6} md={4}>
                <Card style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {election.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {election.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start Date: <span style={{fontWeight: "bold"}}>{formatDate(election.startDate)}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      End Date: <span style={{fontWeight: "bold"}}>{formatDate(election.endDate)}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: 
                    </Typography>
                    <Typography variant="body2" style={{ color: getStatus(election.startDate, election.endDate).color }}>
                      {getStatus(election.startDate, election.endDate).text}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link to={getStatus(election.startDate, election.endDate).text === 'Ended' ? `/electionsResult/${election._id}` : `/elections/${election._id}`}>
                      <Button size="small" color="primary" className='electionCardCnadidatesButton'>
                        {getStatus(election.startDate, election.endDate).text === 'Ended' ? 'View Results' : 'View Candidates'}
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Home;
