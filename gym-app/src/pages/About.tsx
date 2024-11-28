import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            About GymFlex
          </Typography>
          <Typography paragraph>
            GymFlex is your ultimate platform for discovering and booking gym sessions. 
            We connect fitness enthusiasts with top-quality gyms across the city, 
            making it easier than ever to maintain your fitness routine.
          </Typography>
          <Typography paragraph>
            Our mission is to make fitness accessible to everyone by providing a 
            seamless booking experience and connecting users with the best fitness 
            facilities in their area.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;
