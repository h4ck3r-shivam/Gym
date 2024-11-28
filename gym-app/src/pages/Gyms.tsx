import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  Pagination,
} from '@mui/material';
import {
  Search,
  LocationOn,
  AccessTime,
  Star,
  FitnessCenter,
  Pool,
  DirectionsRun,
  SportsGymnastics,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock data - replace with API calls
const mockGyms = [
  {
    id: '1',
    name: 'Fitness Plus',
    location: '123 Main St, City',
    rating: 4.5,
    reviewCount: 128,
    memberCount: 450,
    image: '/gym1.jpg',
    facilities: ['Weights', 'Cardio', 'Pool', 'Classes'],
    openingHours: '06:00 AM - 10:00 PM',
    price: 50,
    description:
      'State-of-the-art fitness facility with a wide range of equipment and classes.',
  },
  {
    id: '2',
    name: 'PowerGym',
    location: '456 Oak St, City',
    rating: 4.2,
    reviewCount: 95,
    memberCount: 320,
    image: '/gym2.jpg',
    facilities: ['Weights', 'Cardio', 'Classes'],
    openingHours: '05:00 AM - 11:00 PM',
    price: 45,
    description:
      'Dedicated to strength training and functional fitness with expert trainers.',
  },
  // Add more mock gyms
];

const facilityIcons = {
  Weights: <FitnessCenter />,
  Pool: <Pool />,
  Cardio: <DirectionsRun />,
  Classes: <SportsGymnastics />,
};

const Gyms: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Filter gyms based on search query
  const filteredGyms = mockGyms.filter(
    (gym) =>
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredGyms.length / itemsPerPage);
  const paginatedGyms = filteredGyms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              bgcolor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Find Your Perfect Gym
            </Typography>
            <Typography variant="subtitle1">
              Discover and compare gyms in your area
            </Typography>
          </Paper>
        </Grid>

        {/* Search */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            placeholder="Search gyms by name or location..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Gym Cards */}
        {paginatedGyms.map((gym) => (
          <Grid item xs={12} sm={6} md={4} key={gym.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={gym.image}
                alt={gym.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {gym.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn
                    fontSize="small"
                    sx={{ color: 'text.secondary', mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {gym.location}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={gym.rating}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({gym.reviewCount} reviews)
                  </Typography>
                </Box>

                <Typography variant="body2" paragraph>
                  {gym.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {gym.facilities.map((facility) => (
                    <Chip
                      key={facility}
                      icon={facilityIcons[facility as keyof typeof facilityIcons]}
                      label={facility}
                      size="small"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime
                    fontSize="small"
                    sx={{ color: 'text.secondary', mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {gym.openingHours}
                  </Typography>
                </Box>

                <Typography variant="h6" color="primary">
                  ${gym.price}/month
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/gyms/${gym.id}`}
                  fullWidth
                  variant="contained"
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Gyms;
