import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { gymAPI } from '../../services/api';
import { Gym } from '../../types';

const GymList = () => {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      setLoading(true);
      const response = await gymAPI.getAllGyms();
      setGyms(response.data.data.gyms);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch gyms');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Your Perfect Gym
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Grid container spacing={3}>
          {filteredGyms.map((gym) => (
            <Grid item xs={12} sm={6} md={4} key={gym._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={gym.images[0]}
                  alt={gym.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {gym.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={gym.rating} readOnly precision={0.5} size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({gym.reviews.length} reviews)
                    </Typography>
                  </Box>
                  <Typography color="text.secondary" paragraph>
                    <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                    {gym.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {gym.description.slice(0, 100)}...
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Starting at ₹{gym.pricing.perDay}/day
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/gyms/${gym._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default GymList;
