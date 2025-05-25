import React, { useState, useEffect } from 'react';
import { CssBaseline, CircularProgress, Container, AppBar, Typography, Box, Paper, Avatar, Grid } from '@mui/material';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import NavBar from '../../components/navBar/NavBar';
import './profile.scss';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="profileContainer">
      <CssBaseline />
      <AppBar position="static" className="appBar">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container maxWidth="lg" className="profileContent">
        <Paper elevation={3} className="profileInfo">
          <Avatar className="profileAvatar">
            {user.firstName.charAt(0)}
          </Avatar>
          <Typography variant="h4" gutterBottom className="profileTitle">
            {user.firstName} {user.lastName}
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Grid container spacing={2} className="profileDetails">
              <Grid item xs={12}>
                <Typography variant="body1" className="profileText">
                  {user.email} {user.emailVerified && <span className="verifiedText"><CheckCircleOutlineIcon className="verifiedIcon" /> Verified</span>}
                </Typography>
              </Grid>
              {/* <Grid item xs={12}>
                <Typography variant="body1" className="profileText">
                  {user.phoneNumber} {user.phoneVerified && <span className="verifiedText"><CheckCircleOutlineIcon className="verifiedIcon" /> Verified</span>}
                </Typography>
              </Grid> */}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Profile;
