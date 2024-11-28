import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { bookingAPI } from '../../services/api';
import { Gym, Slot, BookingRequest } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface GymBookingProps {
  gym: Gym;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  date: Yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
  slotId: Yup.string().required('Time slot is required'),
});

const GymBooking: React.FC<GymBookingProps> = ({ gym, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      slotId: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!stripe || !elements || !currentUser) {
        setError('Payment processing is not available');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get payment method
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }

        if (!paymentMethod) {
          throw new Error('Failed to create payment method');
        }

        // Create booking request
        const bookingData: BookingRequest = {
          gymId: gym._id,
          date: format(values.date, 'yyyy-MM-dd'),
          slotId: values.slotId,
          paymentMethodId: paymentMethod.id,
        };

        await bookingAPI.createBooking(bookingData);
        onSuccess();
      } catch (err: any) {
        setError(err.message || 'Failed to process booking');
      } finally {
        setLoading(false);
      }
    },
  });

  const getAvailableSlots = () => {
    return gym.slots.filter((slot: Slot) => !slot.isBooked);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Book a Session
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Date"
                value={formik.values.date}
                onChange={(newDate: Date | null) => {
                  if (newDate) {
                    formik.setFieldValue('date', newDate);
                  }
                }}
                disablePast
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Time Slot</InputLabel>
            <Select
              value={formik.values.slotId}
              onChange={formik.handleChange}
              name="slotId"
              error={formik.touched.slotId && Boolean(formik.errors.slotId)}
            >
              {getAvailableSlots().map((slot: Slot) => (
                <MenuItem key={slot._id} value={slot._id}>
                  {slot.startTime} - {slot.endTime}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Card Details
            </Typography>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !formik.isValid || !stripe}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              `Pay ₹${gym.pricing.perDay}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GymBooking;
