import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const Home = () => {
  return (
    <>
      <HeroSection>
        <Container>
          <Typography variant="h2" gutterBottom>
            Find Your Perfect Gym
          </Typography>
          <Typography variant="h5" paragraph>
            Book daily, weekly, or monthly memberships at top gyms near you
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Get Started
          </Button>
        </Container>
      </HeroSection>

      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Membership Plans
        </Typography>
        <Grid container spacing={4}>
          {['Daily', 'Weekly', 'Monthly'].map((plan) => (
            <Grid item xs={12} md={4} key={plan}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {plan} Pass
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Access to all gym facilities
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Flexible timing
                  </Typography>
                  <Typography variant="body1" paragraph>
                    No long-term commitment
                  </Typography>
                  <Button variant="contained" color="primary">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
