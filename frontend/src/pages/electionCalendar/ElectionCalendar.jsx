import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CssBaseline, Container, AppBar, Box, CircularProgress } from '@mui/material';
import { Layout, Typography, Card, Calendar, Badge } from 'antd';
import NavBar from '../../components/navBar/NavBar';
import './electionCalendar.scss';
import { API_BASE_URL } from '../../config';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ElectionCalendar = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
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
        const response = await axios.get(`${API_BASE_URL}/elections`, config);
        setElections(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching elections:', error);
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const getListData = (value) => {
    const date = value.format('YYYY-MM-DD');
    return elections.filter((election) => dayjs(election.startDate).format('YYYY-MM-DD') === date).map((election) => {
      const now = dayjs();
      let status;
      if (now.isBefore(dayjs(election.startDate))) {
        status = 'upcoming';
      } else if (now.isAfter(dayjs(election.endDate))) {
        status = 'ended';
      } else {
        status = 'ongoing';
      }

      return {
        content: election.title,
        id: election._id,
        status,
      };
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: "none", cursor: "pointer", padding: "0" }}>
        {listData.map((item) => (
          <div key={item.id} onClick={() => navigate(item.status != 'ended' ? `/elections/${item.id}` : `/electionsResult/${item.id}`)}>
            <Badge status={item.status != 'ended' ? "success" : "error"} text={`${item.content.substring(0, 12)} (${item.status})`} />
          </div>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="electionCalendarContainer">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container maxWidth="lg" className="electionCalendarContent">
        <Box my={4}>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: 'rgb(1, 32, 78)', textAlign: 'center', fontSize: "2rem" }}>
            Election Calendar
          </Typography>
          <Typography variant="body1" gutterBottom style={{ marginBottom: '20px', textAlign: 'center', color: 'rgb(2, 131, 145)' }}>
            Here you can see all the upcoming, ongoing and past elections.
          </Typography>
          <Card className="calendarCard">
            <Calendar dateCellRender={dateCellRender} />
          </Card>
        </Box>
      </Container>
    </div>
  );
};

export default ElectionCalendar;
