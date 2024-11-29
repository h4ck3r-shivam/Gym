import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { gymAPI, bookingAPI } from '../../services/api';
import { Gym, Booking } from '../../types';
import GymList from './GymList';
import BookingList from '../bookings/BookingList';
import GymForm from './GymForm';

const OwnerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingGym, setIsAddingGym] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gymsResponse, bookingsResponse] = await Promise.all([
        gymAPI.getAllGyms(), 
        bookingAPI.fetchBookings() 
      ]);

      setGyms(gymsResponse.data.gyms);
      setBookings(bookingsResponse.data.bookings);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddGym = () => {
    setIsAddingGym(true);
  };

  const handleGymAdded = () => {
    setIsAddingGym(false);
    fetchData();
  };

  const handleGymCancelled = () => {
    setIsAddingGym(false);
  };

  if (!currentUser) {
    return (
      <Alert severity="warning">
        Please log in to access the owner dashboard
      </Alert>
    );
  }

  if (currentUser.role !== 'owner') {
    return (
      <Alert severity="error">
        You do not have permission to access this page
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Owner Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddGym}
        >
          Add New Gym
        </Button>
      </Box>

      {isAddingGym && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Gym
          </Typography>
          <GymForm onSuccess={handleGymAdded} onCancel={handleGymCancelled} />
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Gyms
            </Typography>
            <GymList gyms={gyms} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <BookingList bookings={bookings} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerDashboard;
