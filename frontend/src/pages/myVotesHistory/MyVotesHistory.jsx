import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CssBaseline, Container, AppBar, Box, CircularProgress, Typography, Card } from '@mui/material';
import { List, Badge, Layout } from 'antd';
import NavBar from '../../components/navBar/NavBar';
import './myVotesHistory.scss';
import { API_BASE_URL } from '../../config';

const { Content } = Layout;

const MyVotesHistory = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
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
        const response = await axios.get(`${API_BASE_URL}/my-votes`, config);
        const voteData = response.data;

        const detailedVotes = await Promise.all(voteData.map(async (vote) => {
          const electionResponse = await axios.get(`${API_BASE_URL}/election/${vote.election}`, config);
          const candidateResponse = await axios.get(`${API_BASE_URL}/candidate/${vote.candidate}`, config);

          return {
            ...vote,
            electionTitle: electionResponse.data.title,
            candidateName: candidateResponse.data.name,
          };
        }));

        setVotes(detailedVotes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching votes:', error);
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Layout className="myVotesHistoryContainer">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Content style={{ padding: '0 200px', marginTop: '20px' }} className='myVotesHistoryContainerContent'>
        <Box my={4} textAlign="center">
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: 'rgb(1, 32, 78)', fontSize: '2rem'}}>
            My Votes History
          </Typography>
          <Typography variant="body1" gutterBottom style={{ marginBottom: '20px', color: 'rgb(2, 131, 145)' }}>
            Here you can see all the votes you have casted in different elections.
          </Typography>
        </Box>
        <Card className="votesCard" style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <List
            itemLayout="horizontal"
            dataSource={votes}
            renderItem={(vote) => (
              <List.Item style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Badge status="success" text={<Typography variant="h6" style={{ margin: 0 }}>{`Election: ${vote.electionTitle}`}</Typography>} />
                  <Typography variant="body1" style={{ color: '#555', marginTop: '5px' }}>{`Candidate: ${vote.candidateName}`}</Typography>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default MyVotesHistory;
