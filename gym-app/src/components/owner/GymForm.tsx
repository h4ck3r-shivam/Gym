import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { gymAPI } from '../../services/api';
import { Gym } from '../../types';

interface GymFormProps {
  gym?: Gym;
  mode: 'create' | 'edit';
}

const validationSchema = Yup.object({
  name: Yup.string().required('Gym name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string().required('Pincode is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  description: Yup.string().required('Description is required'),
  facilities: Yup.array().min(1, 'At least one facility is required'),
  pricing: Yup.object({
    perDay: Yup.number().min(0, 'Must be positive').required('Required'),
    perWeek: Yup.number().min(0, 'Must be positive').required('Required'),
    perMonth: Yup.number().min(0, 'Must be positive').required('Required'),
  }),
});

const GymForm: React.FC<GymFormProps> = ({ gym, mode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFacility, setNewFacility] = useState('');

  const formik = useFormik({
    initialValues: {
      name: gym?.name || '',
      address: gym?.address || '',
      city: gym?.city || '',
      state: gym?.state || '',
      pincode: gym?.pincode || '',
      phone: gym?.phone || '',
      email: gym?.email || '',
      description: gym?.description || '',
      facilities: gym?.facilities || [],
      openingTime: gym?.openingTime || '06:00',
      closingTime: gym?.closingTime || '22:00',
      pricing: {
        perDay: gym?.pricing.perDay || 0,
        perWeek: gym?.pricing.perWeek || 0,
        perMonth: gym?.pricing.perMonth || 0,
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        if (mode === 'create') {
          await gymAPI.createGym(values);
        } else {
          await gymAPI.updateGym(gym!._id, values);
        }

        navigate('/owner/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save gym');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAddFacility = () => {
    if (newFacility.trim() && !formik.values.facilities.includes(newFacility.trim())) {
      formik.setFieldValue('facilities', [...formik.values.facilities, newFacility.trim()]);
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (facility: string) => {
    formik.setFieldValue(
      'facilities',
      formik.values.facilities.filter((f) => f !== facility)
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {mode === 'create' ? 'Add New Gym' : 'Edit Gym'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gym Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Facilities
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Facility"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAddFacility} edge="end">
                          <Add />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formik.values.facilities.map((facility) => (
                  <Chip
                    key={facility}
                    label={facility}
                    onDelete={() => handleRemoveFacility(facility)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Timing
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TimePicker
                      label="Opening Time"
                      value={formik.values.openingTime}
                      onChange={(value) => formik.setFieldValue('openingTime', value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TimePicker
                      label="Closing Time"
                      value={formik.values.closingTime}
                      onChange={(value) => formik.setFieldValue('closingTime', value)}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Pricing
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Daily Price"
                    name="pricing.perDay"
                    type="number"
                    value={formik.values.pricing.perDay}
                    onChange={formik.handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Weekly Price"
                    name="pricing.perWeek"
                    type="number"
                    value={formik.values.pricing.perWeek}
                    onChange={formik.handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Monthly Price"
                    name="pricing.perMonth"
                    type="number"
                    value={formik.values.pricing.perMonth}
                    onChange={formik.handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => navigate('/owner/dashboard')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {mode === 'create' ? 'Create Gym' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default GymForm;
