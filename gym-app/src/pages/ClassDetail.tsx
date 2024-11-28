import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Avatar,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  Person,
  LocationOn,
  Check,
  FitnessCenter,
  EventAvailable,
  Star,
  Payment,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// Mock data - replace with API call
const mockClass = {
  id: '1',
  name: 'Morning Yoga',
  instructor: {
    id: 'inst1',
    name: 'Sarah Johnson',
    image: '/instructor1.jpg',
    rating: 4.8,
    bio: 'Certified yoga instructor with 5+ years of experience. Specializes in Vinyasa and Hatha yoga.',
    expertise: ['Vinyasa Yoga', 'Hatha Yoga', 'Meditation'],
  },
  type: 'Yoga',
  level: 'Beginner',
  duration: 60,
  capacity: 20,
  enrolled: 15,
  time: '08:00 AM',
  date: '2024-01-22',
  description:
    'Start your day with energizing yoga poses and breathing exercises. This class is perfect for beginners and focuses on building strength, flexibility, and mindfulness.',
  location: 'Studio A',
  gym: 'Fitness Plus',
  price: 15,
  requirements: [
    'Yoga mat (available for rent)',
    'Comfortable workout clothes',
    'Water bottle',
  ],
  benefits: [
    'Improved flexibility and balance',
    'Stress reduction',
    'Better posture',
    'Increased strength',
  ],
};

const ClassDetail: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenBookingDialog = () => {
    setBookingDialogOpen(true);
  };

  const handleCloseBookingDialog = () => {
    setBookingDialogOpen(false);
  };

  const handleBookClass = () => {
    setLoading(true);
    // Implement booking logic
    setTimeout(() => {
      setLoading(false);
      handleCloseBookingDialog();
      // Show success message or redirect
      navigate('/bookings');
    }, 2000);
  };

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
              {mockClass.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={mockClass.type}
                color="secondary"
                sx={{ color: 'white', bgcolor: 'rgba(255, 255, 255, 0.2)' }}
              />
              <Chip
                label={mockClass.level}
                sx={{ color: 'white', bgcolor: 'rgba(255, 255, 255, 0.2)' }}
              />
            </Box>
            <Typography variant="subtitle1">
              Join us for an amazing fitness experience
            </Typography>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Class Description
            </Typography>
            <Typography paragraph>{mockClass.description}</Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                What You'll Need
              </Typography>
              <List>
                {mockClass.requirements.map((req, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Check color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Benefits
              </Typography>
              <List>
                {mockClass.benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Check color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>

          {/* Instructor Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About the Instructor
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={mockClass.instructor.image}
                alt={mockClass.instructor.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{mockClass.instructor.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    value={mockClass.instructor.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({mockClass.instructor.rating})
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography paragraph>{mockClass.instructor.bio}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {mockClass.instructor.expertise.map((exp, index) => (
                <Chip key={index} label={exp} size="small" />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom>
              Class Details
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <AccessTime />
                </ListItemIcon>
                <ListItemText
                  primary="Date & Time"
                  secondary={`${format(new Date(mockClass.date), 'PPP')} at ${
                    mockClass.time
                  } (${mockClass.duration} min)`}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="Availability"
                  secondary={`${mockClass.enrolled}/${mockClass.capacity} spots filled`}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <LocationOn />
                </ListItemIcon>
                <ListItemText
                  primary="Location"
                  secondary={`${mockClass.location} at ${mockClass.gym}`}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Payment />
                </ListItemIcon>
                <ListItemText
                  primary="Price"
                  secondary={`$${mockClass.price} per class`}
                />
              </ListItem>
            </List>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleOpenBookingDialog}
              disabled={mockClass.enrolled >= mockClass.capacity}
              sx={{ mt: 2 }}
            >
              {mockClass.enrolled >= mockClass.capacity
                ? 'Class Full'
                : 'Book Now'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialogOpen}
        onClose={handleCloseBookingDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {mockClass.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {format(new Date(mockClass.date), 'PPP')} at {mockClass.time}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Booking Summary
              </Typography>
              <Box
                sx={{
                  bgcolor: theme.palette.grey[50],
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography>Class Fee</Typography>
                  <Typography>${mockClass.price}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 1,
                    mt: 1,
                  }}
                >
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1">${mockClass.price}</Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              By clicking 'Confirm Booking', you agree to our booking terms and
              cancellation policy.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingDialog}>Cancel</Button>
          <Button
            onClick={handleBookClass}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClassDetail;
