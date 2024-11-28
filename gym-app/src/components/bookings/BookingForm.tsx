import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import { bookingAPI } from '../../services/api';
import { Gym, Slot, BookingRequest } from '../../types';
import { format } from 'date-fns';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface BookingFormProps {
  gym: Gym;
  selectedSlot: Slot | null;
  onBookingComplete: () => void;
}

const steps = ['Select Plan', 'Choose Date', 'Payment'];

const BookingForm: React.FC<BookingFormProps> = ({
  gym,
  selectedSlot,
  onBookingComplete,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<'perDay' | 'perWeek' | 'perMonth'>('perDay');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.value as 'perDay' | 'perWeek' | 'perMonth');
  };

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    if (!selectedSlot || !selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      const bookingData: BookingRequest = {
        gymId: gym._id,
        slotId: selectedSlot._id,
        startDate: selectedDate.toISOString(),
        paymentMethodId,
        plan: selectedPlan as 'perDay' | 'perWeek' | 'perMonth',
      };

      await bookingAPI.createBooking(bookingData);

      onBookingComplete();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Your Plan
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value={selectedPlan} onChange={handlePlanChange}>
                <FormControlLabel
                  value="perDay"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Daily Pass</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{gym.pricing.perDay} per day
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="perWeek"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Weekly Pass</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{gym.pricing.perWeek} per week
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="perMonth"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Monthly Pass</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{gym.pricing.perMonth} per month
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Start Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                disablePast
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
            {selectedSlot && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Selected Time Slot:
                </Typography>
                <Typography>
                  {format(new Date(selectedSlot.startTime), 'p')} -{' '}
                  {format(new Date(selectedSlot.endTime), 'p')}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={gym.pricing[selectedPlan]}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
