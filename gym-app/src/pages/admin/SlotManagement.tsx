import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface Slot {
  id: string;
  time: string;
  capacity: number;
  available: number;
  status: 'available' | 'full' | 'closed';
}

const validationSchema = yup.object({
  time: yup.string().required('Time is required'),
  capacity: yup.number().required('Capacity is required').min(1, 'Minimum capacity is 1'),
});

const SlotManagement = () => {
  const [slots, setSlots] = useState<Slot[]>([
    { id: '1', time: '06:00-07:00', capacity: 20, available: 15, status: 'available' },
    { id: '2', time: '07:00-08:00', capacity: 20, available: 0, status: 'full' },
    { id: '3', time: '08:00-09:00', capacity: 20, available: 20, status: 'available' },
    { id: '4', time: '17:00-18:00', capacity: 20, available: 10, status: 'available' },
    { id: '5', time: '18:00-19:00', capacity: 20, available: 5, status: 'available' },
    { id: '6', time: '19:00-20:00', capacity: 20, available: 0, status: 'closed' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);

  const formik = useFormik({
    initialValues: {
      time: '',
      capacity: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const newSlot: Slot = {
        id: Date.now().toString(),
        time: values.time,
        capacity: Number(values.capacity),
        available: Number(values.capacity),
        status: 'available',
      };
      setSlots([...slots, newSlot]);
      handleCloseDialog();
    },
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4caf50';
      case 'full':
        return '#f44336';
      case 'closed':
        return '#9e9e9e';
      default:
        return '#000000';
    }
  };

  const handleStatusChange = (slotId: string, newStatus: 'available' | 'full' | 'closed') => {
    setSlots(
      slots.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              status: newStatus,
              available: newStatus === 'closed' ? 0 : slot.available,
            }
          : slot
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom>
            Slot Management
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Add New Slot
          </Button>
        </Grid>

        {slots.map((slot) => (
          <Grid item xs={12} sm={6} md={4} key={slot.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {slot.time}
                </Typography>
                <Typography color="textSecondary">
                  Capacity: {slot.capacity}
                </Typography>
                <Typography color="textSecondary">
                  Available: {slot.available}
                </Typography>
                <Typography
                  sx={{
                    color: getStatusColor(slot.status),
                    textTransform: 'capitalize',
                    mt: 1,
                  }}
                >
                  Status: {slot.status}
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Change Status</InputLabel>
                  <Select
                    value={slot.status}
                    label="Change Status"
                    onChange={(e) => handleStatusChange(slot.id, e.target.value as any)}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="full">Full</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add New Slot</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="time"
              name="time"
              label="Time Slot (e.g., 09:00-10:00)"
              value={formik.values.time}
              onChange={formik.handleChange}
              error={formik.touched.time && Boolean(formik.errors.time)}
              helperText={formik.touched.time && formik.errors.time}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              id="capacity"
              name="capacity"
              label="Capacity"
              type="number"
              value={formik.values.capacity}
              onChange={formik.handleChange}
              error={formik.touched.capacity && Boolean(formik.errors.capacity)}
              helperText={formik.touched.capacity && formik.errors.capacity}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Slot
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default SlotManagement;
