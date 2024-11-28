import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Rating,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  ImageList,
  ImageListItem,
  Dialog,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FitnessCenter,
  LocalParking,
  Shower,
  Pool,
  Restaurant,
  Wifi,
  Person,
  CalendarToday,
  Close as CloseIcon,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { gymAPI } from '../../services/api';
import { Gym, Review } from '../../types';
import { useCache } from '../../hooks/useCache';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const amenityIcons: { [key: string]: React.ReactElement } = {
  'Fitness Equipment': <FitnessCenter />,
  'Parking Space': <LocalParking />,
  'Shower Room': <Shower />,
  'Swimming Pool': <Pool />,
  'Cafeteria': <Restaurant />,
  'Free WiFi': <Wifi />,
};

const GymDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { getCache, setCache } = useCache();

  const fetchGymDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const cachedGym = getCache(`gym-${id}`) as Gym | null;
      if (cachedGym) {
        setGym(cachedGym);
        setLoading(false);
        return;
      }

      const response = await gymAPI.getGym(id!);
      const fetchedGym = response.data.data.gym;
      setGym(fetchedGym);
      setCache(`gym-${id}`, fetchedGym, 5 * 60 * 1000); // Cache for 5 minutes
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch gym details');
    } finally {
      setLoading(false);
    }
  }, [id, getCache, setCache]);

  useEffect(() => {
    fetchGymDetails();
  }, [fetchGymDetails]);

  const handleBookNow = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/gyms/${id}` } });
      return;
    }
    if (gym) {
      navigate(`/gyms/${gym._id}/book`, { state: { gym } });
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && gym) {
      setSelectedImageIndex((prevIndex: number | null) => {
        if (prevIndex === null) return 0;
        return prevIndex === 0 ? gym.images.length - 1 : prevIndex - 1;
      });
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && gym) {
      setSelectedImageIndex((prevIndex: number | null) => {
        if (prevIndex === null) return 0;
        return prevIndex === gym.images.length - 1 ? 0 : prevIndex + 1;
      });
    }
  };

  const renderReviewUser = (review: Review) => {
    if (typeof review.user === 'string') {
      return review.user;
    }
    return `${review.user.firstName} ${review.user.lastName}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} role="alert" aria-label="Loading gym details">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!gym) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">Gym not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="400"
                image={gym.images[0]}
                alt={`Main image of ${gym.name}`}
                sx={{ objectFit: 'cover' }}
                loading="lazy"
              />
            </Box>
            
            <ImageList sx={{ mt: 1 }} cols={4} rowHeight={100}>
              {gym.images.map((image, index) => (
                <ImageListItem 
                  key={index}
                  onClick={() => handleImageClick(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  <img
                    src={`${image}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={`${gym.name} image ${index + 1}`}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {gym.name}
                </Typography>
                <Box>
                  <Rating 
                    value={gym.rating} 
                    readOnly 
                    precision={0.5}
                    aria-label={`Rated ${gym.rating} out of 5 stars`}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {gym.reviews.length} reviews
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {gym.description}
              </Typography>

              <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
                Location
              </Typography>
              <Typography variant="body1" paragraph>
                {gym.address}
              </Typography>

              <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
                Amenities
              </Typography>
              <Grid container spacing={1} role="list">
                {gym.amenities.map((amenity) => (
                  <Grid item key={amenity} role="listitem">
                    <Chip
                      icon={amenityIcons[amenity]}
                      label={amenity}
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Reviews
            </Typography>
            {gym.reviews.length === 0 ? (
              <Typography color="text.secondary">No reviews yet</Typography>
            ) : (
              <List aria-label="Reviews list">
                {gym.reviews.map((review: Review) => (
                  <React.Fragment key={review._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Person aria-hidden="true" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography component="span" variant="subtitle1">
                              {renderReviewUser(review)}
                            </Typography>
                            <Rating 
                              value={review.rating} 
                              size="small" 
                              readOnly 
                              aria-label={`Rated ${review.rating} out of 5 stars`}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(review.createdAt), 'dd MMM yyyy')}
                            </Typography>
                          </Box>
                        }
                        secondary={review.comment}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Membership Plans
              </Typography>
              <List aria-label="Membership plans">
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday aria-hidden="true" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Daily Pass"
                    secondary={`₹${gym.pricing.perDay}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday aria-hidden="true" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Weekly Pass"
                    secondary={`₹${gym.pricing.perWeek}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday aria-hidden="true" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Monthly Pass"
                    secondary={`₹${gym.pricing.perMonth}`}
                  />
                </ListItem>
              </List>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleBookNow}
                sx={{ mt: 2 }}
                aria-label="Book membership"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Gallery Dialog */}
      <Dialog
        open={selectedImageIndex !== null}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            }}
            aria-label="Close image gallery"
          >
            <CloseIcon />
          </IconButton>
          
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            }}
            aria-label="Previous image"
          >
            <NavigateBefore />
          </IconButton>
          
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            }}
            aria-label="Next image"
          >
            <NavigateNext />
          </IconButton>

          {selectedImageIndex !== null && (
            <img
              src={gym.images[selectedImageIndex]}
              alt={`${gym.name} full view ${selectedImageIndex + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default GymDetail;
