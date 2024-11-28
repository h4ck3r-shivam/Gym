import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { format } from 'date-fns';

interface ClassBookingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  classData: {
    id: string;
    name: string;
    instructor: string;
    date: string;
    time: string;
    duration: number;
    price: number;
  };
}

interface BookingFormData {
  notes?: string;
  acceptTerms: boolean;
  acceptCancellation: boolean;
}

const ClassBookingForm: React.FC<ClassBookingFormProps> = ({
  open,
  onClose,
  onSubmit,
  classData,
}) => {
  const [formData, setFormData] = React.useState<BookingFormData>({
    notes: '',
    acceptTerms: false,
    acceptCancellation: false,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (
    field: keyof BookingFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book class');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.acceptTerms && formData.acceptCancellation;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book Class</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">{classData.name}</Typography>
          <Typography color="text.secondary">
            with {classData.instructor}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Class Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {format(new Date(classData.date), 'MMMM dd, yyyy')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time: {classData.time} ({classData.duration} minutes)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${classData.price}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Special Notes or Requirements"
          placeholder="Any medical conditions, injuries, or special requirements we should know about?"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.acceptTerms}
              onChange={(e) => handleChange('acceptTerms', e.target.checked)}
            />
          }
          label="I agree to the terms and conditions"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.acceptCancellation}
              onChange={(e) =>
                handleChange('acceptCancellation', e.target.checked)
              }
            />
          }
          label="I understand the cancellation policy"
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!isFormValid}
          variant="contained"
        >
          Book Now
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ClassBookingForm;
