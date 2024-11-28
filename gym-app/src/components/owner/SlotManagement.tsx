import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { slotAPI } from '../../services/api';
import { Slot } from '../../types';

interface SlotManagementProps {
  gymId: string;
}

const validationSchema = Yup.object({
  startTime: Yup.date().required('Start time is required'),
  endTime: Yup.date()
    .required('End time is required')
    .min(Yup.ref('startTime'), 'End time must be after start time'),
  capacity: Yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be non-negative'),
});

const SlotManagement: React.FC<SlotManagementProps> = ({ gymId }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  useEffect(() => {
    fetchSlots();
  }, [gymId]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await slotAPI.getGymSlots(gymId);
      setSlots(response.data.data.slots);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      startTime: selectedSlot?.startTime || new Date(),
      endTime: selectedSlot?.endTime || new Date(),
      capacity: selectedSlot?.capacity || 10,
      price: selectedSlot?.price || 0,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (selectedSlot) {
          await slotAPI.updateSlot(selectedSlot._id, values);
        } else {
          await slotAPI.createSlot(gymId, values);
        }
        await fetchSlots();
        handleCloseDialog();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save slot');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOpenDialog = (slot?: Slot) => {
    setSelectedSlot(slot || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedSlot(null);
    setDialogOpen(false);
    formik.resetForm();
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      setLoading(true);
      await slotAPI.deleteSlot(slotId);
      await fetchSlots();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete slot');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dialogOpen) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Manage Time Slots</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add New Slot
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell align="center">Capacity</TableCell>
                <TableCell align="center">Available</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.map((slot) => (
                <TableRow key={slot._id}>
                  <TableCell>
                    {format(new Date(slot.startTime), 'p')} -{' '}
                    {format(new Date(slot.endTime), 'p')}
                  </TableCell>
                  <TableCell align="center">{slot.capacity}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${slot.available} spots`}
                      color={slot.available > 0 ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">₹{slot.price}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(slot)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSlot(slot._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {slots.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No slots available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>
              {selectedSlot ? 'Edit Slot' : 'Add New Slot'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TimePicker
                          label="Start Time"
                          value={formik.values.startTime}
                          onChange={(value) => formik.setFieldValue('startTime', value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TimePicker
                          label="End Time"
                          value={formik.values.endTime}
                          onChange={(value) => formik.setFieldValue('endTime', value)}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                    helperText={formik.touched.capacity && formik.errors.capacity}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                {selectedSlot ? 'Save Changes' : 'Add Slot'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SlotManagement;
