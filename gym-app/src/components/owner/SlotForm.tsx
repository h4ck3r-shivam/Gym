import React from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography 
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreateSlotDTO, UpdateSlotDTO, Slot } from '../../types';

interface SlotFormProps {
  gymId?: string;
  onSubmit: (slotData: CreateSlotDTO | UpdateSlotDTO) => Promise<void>;
  initialData?: Partial<Slot>;
  onCancel: () => void;
}

const SlotForm: React.FC<SlotFormProps> = ({ 
  gymId, 
  onSubmit, 
  initialData = {},
  onCancel 
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Slot name is required'),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
    capacity: Yup.number().positive().required('Capacity is required'),
    price: Yup.object({
      day: Yup.number().positive().required('Daily price is required'),
      week: Yup.number().positive().required('Weekly price is required'),
      month: Yup.number().positive().required('Monthly price is required'),
    }).required('Pricing is required')
  });

  const formik = useFormik({
    initialValues: {
      name: initialData.name || '',
      startTime: initialData.startTime || '',
      endTime: initialData.endTime || '',
      capacity: initialData.capacity || 0,
      price: {
        day: initialData.price?.day || 0,
        week: initialData.price?.week || 0,
        month: initialData.price?.month || 0,
      },
      daysAvailable: initialData.daysAvailable || [],
      isActive: initialData.isActive ?? true
    },
    validationSchema,
    onSubmit: async (values) => {
      const submitData = initialData.id 
        ? { ...values } as UpdateSlotDTO 
        : { ...values, gymId } as CreateSlotDTO;
      await onSubmit(submitData);
    }
  });

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6">
        {initialData.name ? 'Edit Slot' : 'Create New Slot'}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Slot Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="startTime"
              name="startTime"
              label="Start Time"
              type="time"
              value={formik.values.startTime}
              onChange={formik.handleChange}
              error={formik.touched.startTime && Boolean(formik.errors.startTime)}
              helperText={formik.touched.startTime && formik.errors.startTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="endTime"
              name="endTime"
              label="End Time"
              type="time"
              value={formik.values.endTime}
              onChange={formik.handleChange}
              error={formik.touched.endTime && Boolean(formik.errors.endTime)}
              helperText={formik.touched.endTime && formik.errors.endTime}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
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
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              id="price.day"
              name="price.day"
              label="Daily Price"
              type="number"
              value={formik.values.price.day}
              onChange={formik.handleChange}
              error={formik.touched.price?.day && Boolean(formik.errors.price?.day)}
              helperText={formik.touched.price?.day && formik.errors.price?.day}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              id="price.week"
              name="price.week"
              label="Weekly Price"
              type="number"
              value={formik.values.price.week}
              onChange={formik.handleChange}
              error={formik.touched.price?.week && Boolean(formik.errors.price?.week)}
              helperText={formik.touched.price?.week && formik.errors.price?.week}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              id="price.month"
              name="price.month"
              label="Monthly Price"
              type="number"
              value={formik.values.price.month}
              onChange={formik.handleChange}
              error={formik.touched.price?.month && Boolean(formik.errors.price?.month)}
              helperText={formik.touched.price?.month && formik.errors.price?.month}
            />
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
              >
                {initialData.name ? 'Update Slot' : 'Create Slot'}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                variant="outlined" 
                color="secondary" 
                fullWidth
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SlotForm;
