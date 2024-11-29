import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI } from '../../services/api';
import { Gym, BookingRequest } from '../../types';
import { format } from 'date-fns';

interface GymBookingProps {
  gym: Gym;
  selectedSlot: string;
  selectedDate: string;
  selectedPlan: 'perDay' | 'perWeek' | 'perMonth';
  onSuccess?: () => void;
}

const GymBooking: React.FC<GymBookingProps> = ({
  gym,
  selectedSlot,
  selectedDate,
  selectedPlan,
  onSuccess
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!currentUser) {
      setError('Please login to book a slot');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingData: BookingRequest = {
        gymId: gym._id,
        slotId: selectedSlot,
        startDate: selectedDate,
        plan: selectedPlan
      };

      await bookingAPI.createBooking(bookingData);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to book slot';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Booking Details
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Gym:</strong> {gym.name}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {format(new Date(selectedDate), 'MMMM dd, yyyy')}
          </Typography>
          <Typography variant="body1">
            <strong>Plan:</strong> {selectedPlan}
          </Typography>
          <Typography variant="body1">
            <strong>Price:</strong> ₹{gym.pricing[selectedPlan]}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleBooking}
          disabled={loading || !currentUser}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GymBooking;
