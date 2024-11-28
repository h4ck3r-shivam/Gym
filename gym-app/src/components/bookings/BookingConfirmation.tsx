import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  AccessTime,
  LocationOn,
  Person,
  Event,
  Payment,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  open: boolean;
  onClose: () => void;
  onAddToCalendar: () => void;
  booking: {
    id: string;
    classInfo: {
      name: string;
      type: string;
      level: string;
      instructor: string;
    };
    date: string;
    time: string;
    duration: number;
    location: string;
    payment: {
      amount: number;
      method: string;
    };
  };
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  open,
  onClose,
  onAddToCalendar,
  booking,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <CheckCircle
            color="success"
            sx={{ fontSize: 48, mb: 1 }}
          />
          <Typography variant="h5">Booking Confirmed!</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="success" sx={{ mb: 3 }}>
          Your booking has been successfully confirmed. We've sent a
          confirmation email with all the details.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {booking.classInfo.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={booking.classInfo.type}
              color="primary"
              size="small"
            />
            <Chip
              label={booking.classInfo.level}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              {booking.classInfo.instructor}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Event sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              {booking.time} ({booking.duration} minutes)
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              {booking.location}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Payment Details
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Payment sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography color="text.secondary">
              ${booking.payment.amount} - Paid with {booking.payment.method}
            </Typography>
          </Box>
        </Box>

        <Alert severity="info">
          Please arrive 10 minutes before the class starts. Don't forget to
          bring appropriate workout gear and a water bottle.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={onAddToCalendar}
          startIcon={<Event />}
        >
          Add to Calendar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingConfirmation;
