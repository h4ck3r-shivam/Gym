import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Chip,
  Button,
  Skeleton,
} from '@mui/material';
import { LocationOn, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Gym } from '../../types';

interface SearchResultsProps {
  gyms: Gym[];
  loading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ gyms, loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={24} width="60%" />
                <Skeleton variant="text" height={24} width="40%" />
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="rectangular" height={36} width={100} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (gyms.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No gyms found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or search criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {gyms.map((gym) => (
        <Grid item xs={12} sm={6} md={4} key={gym._id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.2s ease-in-out',
                boxShadow: 4,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={gym.images[0] || '/default-gym.jpg'}
              alt={gym.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {gym.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={gym.rating} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({gym.reviewCount} reviews)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {gym.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  {gym.openingHours} - {gym.closingHours}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                {gym.facilities.slice(0, 3).map((facility) => (
                  <Chip
                    key={facility}
                    label={facility}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
                {gym.facilities.length > 3 && (
                  <Chip
                    label={`+${gym.facilities.length - 3} more`}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 0.5 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary">
                  ₹{gym.pricePerMonth}/month
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/gym/${gym._id}`)}
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SearchResults;
