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
import { format } from 'date-fns';

interface GymFormProps {
  gym?: Gym;
  mode: 'create' | 'edit';
  onSubmit: (values: any) => Promise<void>;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Gym name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string().required('Pincode is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  description: Yup.string().required('Description is required'),
  facilities: Yup.array().min(1, 'At least one facility is required'),
  amenities: Yup.array().min(1, 'At least one amenity is required'),
  openingTime: Yup.string().required('Opening time is required'),
  closingTime: Yup.string().required('Closing time is required'),
  pricing: Yup.object().shape({
    perDay: Yup.number().min(0, 'Must be greater than 0').required('Per day price is required'),
    perWeek: Yup.number().min(0, 'Must be greater than 0').required('Per week price is required'),
    perMonth: Yup.number().min(0, 'Must be greater than 0').required('Per month price is required'),
  }),
  images: Yup.array(),
});

const GymForm: React.FC<GymFormProps> = ({ gym, mode, onSubmit }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFacility, setNewFacility] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const formik = useFormik({
    initialValues: {
      name: gym?.name || '',
      address: gym?.address || '',
      city: gym?.city || '',
      state: gym?.state || '',
      pincode: gym?.pincode || '',
      phoneNumber: gym?.phoneNumber || '',
      email: gym?.email || '',
      description: gym?.description || '',
      facilities: gym?.facilities || [],
      amenities: gym?.amenities || [],
      openingTime: gym?.openingTime || '',
      closingTime: gym?.closingTime || '',
      pricing: {
        perDay: gym?.pricing?.perDay || 0,
        perWeek: gym?.pricing?.perWeek || 0,
        perMonth: gym?.pricing?.perMonth || 0,
      },
      images: gym?.images || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        await onSubmit(values);
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

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formik.values.amenities.includes(newAmenity.trim())) {
      formik.setFieldValue('amenities', [...formik.values.amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    formik.setFieldValue(
      'amenities',
      formik.values.amenities.filter((a) => a !== amenity)
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
                label="Phone Number"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber as string}
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
                Amenities
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Amenity"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAddAmenity} edge="end">
                          <Add />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formik.values.amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onDelete={() => handleRemoveAmenity(amenity)}
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
                    <TextField
                      fullWidth
                      label="Opening Time"
                      type="time"
                      name="openingTime"
                      value={formik.values.openingTime}
                      onChange={formik.handleChange}
                      error={formik.touched.openingTime && Boolean(formik.errors.openingTime)}
                      helperText={formik.touched.openingTime && formik.errors.openingTime}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Closing Time"
                      type="time"
                      name="closingTime"
                      value={formik.values.closingTime}
                      onChange={formik.handleChange}
                      error={formik.touched.closingTime && Boolean(formik.errors.closingTime)}
                      helperText={formik.touched.closingTime && formik.errors.closingTime}
                      InputLabelProps={{ shrink: true }}
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
                    error={formik.touched.pricing?.perDay && Boolean(formik.errors.pricing?.perDay)}
                    helperText={formik.touched.pricing?.perDay && formik.errors.pricing?.perDay}
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
                    error={formik.touched.pricing?.perWeek && Boolean(formik.errors.pricing?.perWeek)}
                    helperText={formik.touched.pricing?.perWeek && formik.errors.pricing?.perWeek}
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
                    error={formik.touched.pricing?.perMonth && Boolean(formik.errors.pricing?.perMonth)}
                    helperText={formik.touched.pricing?.perMonth && formik.errors.pricing?.perMonth}
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
              {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Create Gym' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default GymForm;
