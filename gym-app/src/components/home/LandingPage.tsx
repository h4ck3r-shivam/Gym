import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme } from '@mui/material';
import { FitnessCenter, Schedule, Payment, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <FitnessCenter sx={{ fontSize: 40 }} />,
    title: 'Premium Gyms',
    description: 'Access to top-rated fitness facilities across the city'
  },
  {
    icon: <Schedule sx={{ fontSize: 40 }} />,
    title: 'Flexible Booking',
    description: 'Book slots that fit your schedule with daily, weekly, or monthly plans'
  },
  {
    icon: <Payment sx={{ fontSize: 40 }} />,
    title: 'Easy Payments',
    description: 'Secure and hassle-free payment processing'
  },
  {
    icon: <Star sx={{ fontSize: 40 }} />,
    title: 'Verified Reviews',
    description: 'Real feedback from gym members to help you choose'
  }
];

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Find Your Perfect Gym
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Book top-rated gyms instantly. Your fitness journey starts here.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/gyms')}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                mr: 2
              }}
            >
              Explore Gyms
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Join Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Start Your Fitness Journey?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Join thousands of satisfied members who've found their perfect gym
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
