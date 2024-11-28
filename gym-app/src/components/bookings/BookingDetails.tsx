import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Person,
  Event,
  Payment,
  Receipt,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface BookingDetailsProps {
  booking: {
    id: string;
    classInfo: {
      name: string;
      type: string;
      level: string;
      instructor: {
        id: string;
        name: string;
        image?: string;
      };
      description: string;
    };
    date: string;
    time: string;
    duration: number;
    location: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    payment: {
      amount: number;
      status: string;
      method: string;
      date: string;
    };
    cancellationPolicy: string;
  };
  onCancel: () => void;
  onReschedule: () => void;
  onDownloadReceipt: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  booking,
  onCancel,
  onReschedule,
  onDownloadReceipt,
}) => {
  const isUpcoming = booking.status === 'upcoming';
  const isCancelled = booking.status === 'cancelled';

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {booking.classInfo.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={booking.classInfo.type}
                  color="primary"
                />
                <Chip
                  label={booking.classInfo.level}
                  variant="outlined"
                />
                <Chip
                  label={booking.status}
                  color={
                    isUpcoming
                      ? 'primary'
                      : isCancelled
                      ? 'default'
                      : 'success'
                  }
                />
              </Box>
            </Box>
            {isUpcoming && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onCancel}
                >
                  Cancel Booking
                </Button>
                <Button
                  variant="contained"
                  onClick={onReschedule}
                >
                  Reschedule
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Class Details
            </Typography>
            <Typography color="text.secondary">
              {booking.classInfo.description}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Schedule Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Event sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography color="text.secondary">
                    {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography color="text.secondary">
                    {booking.time} ({booking.duration} minutes)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Instructor
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {booking.classInfo.instructor.name}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Cancellation Policy
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              {booking.cancellationPolicy}
            </Alert>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ p: 3, bgcolor: 'background.default' }}
          >
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Amount</Typography>
                <Typography>${booking.payment.amount}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Status</Typography>
                <Chip
                  label={booking.payment.status}
                  size="small"
                  color="success"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Method</Typography>
                <Typography>{booking.payment.method}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography color="text.secondary">Date</Typography>
                <Typography>
                  {format(
                    new Date(booking.payment.date),
                    'MMM d, yyyy'
                  )}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Receipt />}
              onClick={onDownloadReceipt}
            >
              Download Receipt
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookingDetails;
