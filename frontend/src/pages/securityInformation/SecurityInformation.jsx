import React from 'react';
import { CssBaseline, Container, AppBar, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Paper, Divider, Grid, Card, CardContent } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import TimerIcon from '@mui/icons-material/Timer';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import HttpsIcon from '@mui/icons-material/Https';
import BlockIcon from '@mui/icons-material/Block';
import { SmileOutlined } from '@ant-design/icons';
import NavBar from '../../components/navBar/NavBar';
import './securityInformation.scss';

const SecurityInformation = () => {
  const securityMeasures = [
    {
      icon: <FingerprintIcon style={{ color: '#388e3c', fontSize: '40px' }} />,
      text: 'One-time ID and password',
    },
    {
      icon: <TimerIcon style={{ color: '#f57c00', fontSize: '40px' }} />,
      text: 'Session expires after 1 hour',
    },
    {
      icon: <BlockIcon style={{ color: '#d32f2f', fontSize: '40px' }} />,
      text: 'JWT token for secure API access',
    },
    {
      icon: <VerifiedUserIcon style={{ color: '#7b1fa2', fontSize: '40px' }} />,
      text: 'Using the latest stable software versions',
    },
    {
      icon: <LockIcon style={{ color: '#d32f2f', fontSize: '40px' }} />,
      text: 'Atomic transactions in the vote process',
    },
    {
        icon: <HttpsIcon style={{ color: '#009688', fontSize: '40px' }} />,
        text: 'SSL/TLS encryption for secure communication',
    },
    {
      icon: <SecurityIcon style={{ color: '#1976d2', fontSize: '40px' }} />,
      text: 'Votes encrypted using two private keys with Shamir\'s secret sharing',
    },
  ];

  return (
    <div className="securityInformationContainer">
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <NavBar />
        </Container>
      </AppBar>
      <Container maxWidth="lg" className="securityInformationContent">
        <Box my={4}>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#01204E', textAlign: 'center' }}>
            Security Measures
          </Typography>
          <Typography variant="body1" gutterBottom style={{ marginBottom: '20px', textAlign: 'center' , color: '#028391' }}>
            To ensure the integrity and security of our voting system, we have implemented the following measures:
          </Typography>
          <Grid container spacing={4}>
            {securityMeasures.map((measure, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="securityCard" elevation={3} style={{ backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <ListItemIcon>{measure.icon}</ListItemIcon>
                      <Typography variant="h6" align="center" style={{ marginTop: '10px' }}>
                        {measure.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default SecurityInformation;
