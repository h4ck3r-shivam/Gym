import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI } from '../../services/api';
import { format } from 'date-fns';
import { Booking } from '../../types';

const ProfileDashboard: React.FC = () => {
  const { currentUser, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings(token);
      if (response.success) {
        setBookings(response.data.bookings);
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container>
        <Alert severity="error">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={currentUser.avatar}
                sx={{ width: 80, height: 80, mr: 2 }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography color="textSecondary">{currentUser.role}</Typography>
              </Box>
            </Box>

            <List>
              <ListItem>
                <EmailIcon sx={{ mr: 2 }} />
                <ListItemText primary="Email" secondary={currentUser.email} />
              </ListItem>
              <ListItem>
                <PhoneIcon sx={{ mr: 2 }} />
                <ListItemText
                  primary="Phone"
                  secondary={currentUser.phoneNumber}
                />
              </ListItem>
            </List>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              fullWidth
              sx={{ mt: 2 }}
              href="/settings"
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {!loading && bookings.length === 0 && (
              <Typography color="textSecondary">
                No bookings found
              </Typography>
            )}

            {bookings.map((booking, index) => (
              <React.Fragment key={booking._id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <Box>
                  <Typography variant="subtitle1">
                    {booking.gym.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {format(new Date(booking.startDate), 'PPP')} -{' '}
                    {format(new Date(booking.endDate), 'PPP')}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Time: {booking.slot.startTime} - {booking.slot.endTime}
                  </Typography>
                  <Typography
                    color={
                      booking.status === 'confirmed'
                        ? 'success.main'
                        : booking.status === 'cancelled'
                        ? 'error.main'
                        : 'warning.main'
                    }
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Typography>
                </Box>
              </React.Fragment>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileDashboard;
