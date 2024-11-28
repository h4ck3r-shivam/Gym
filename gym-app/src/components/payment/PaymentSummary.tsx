import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CreditCard, Lock } from '@mui/icons-material';

interface PaymentSummaryProps {
  booking: {
    gymName: string;
    plan: string;
    duration: string;
    startDate: string;
    basePrice: number;
    taxes: number;
    discount?: number;
    total: number;
  };
  loading?: boolean;
  error?: string | null;
  onProceedToPayment: () => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  booking,
  loading = false,
  error = null,
  onProceedToPayment,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Summary
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Gym
          </Typography>
          <Typography variant="body1">{booking.gymName}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Plan Details
          </Typography>
          <Typography variant="body1">
            {booking.plan} - {booking.duration}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Starting from {new Date(booking.startDate).toLocaleDateString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Base Price
            </Typography>
            <Typography variant="body1">₹{booking.basePrice}</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Taxes & Fees
            </Typography>
            <Typography variant="body1">₹{booking.taxes}</Typography>
          </Box>

          {booking.discount && booking.discount > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="body2" color="success.main">
                Discount Applied
              </Typography>
              <Typography variant="body1" color="success.main">
                -₹{booking.discount}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography variant="subtitle1">Total Amount</Typography>
          <Typography variant="h6" color="primary">
            ₹{booking.total}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<CreditCard />}
          onClick={onProceedToPayment}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            'Proceed to Payment'
          )}
        </Button>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Lock fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Secure payment powered by Stripe
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
