import React from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  gymName: yup.string().required('Gym name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string().required('PIN code is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  facilities: yup.array().min(1, 'Select at least one facility'),
  description: yup.string().required('Description is required'),
  openingTime: yup.string().required('Opening time is required'),
  closingTime: yup.string().required('Closing time is required'),
  pricePerDay: yup.number().required('Daily price is required').min(0, 'Price cannot be negative'),
  pricePerWeek: yup.number().required('Weekly price is required').min(0, 'Price cannot be negative'),
  pricePerMonth: yup.number().required('Monthly price is required').min(0, 'Price cannot be negative'),
});

const facilities = [
  'Cardio Equipment',
  'Weight Training',
  'Personal Training',
  'Yoga Classes',
  'Zumba Classes',
  'Swimming Pool',
  'Sauna',
  'Locker Room',
  'Parking',
  'Wifi',
];

const GymRegistration = () => {
  const formik = useFormik({
    initialValues: {
      gymName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      facilities: [],
      description: '',
      openingTime: '',
      closingTime: '',
      pricePerDay: '',
      pricePerWeek: '',
      pricePerMonth: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register Your Gym
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="gymName"
                name="gymName"
                label="Gym Name"
                value={formik.values.gymName}
                onChange={formik.handleChange}
                error={formik.touched.gymName && Boolean(formik.errors.gymName)}
                helperText={formik.touched.gymName && formik.errors.gymName}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                multiline
                rows={2}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="state"
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pincode"
                name="pincode"
                label="PIN Code"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Facilities</InputLabel>
                <Select
                  multiple
                  id="facilities"
                  name="facilities"
                  value={formik.values.facilities}
                  onChange={formik.handleChange}
                  error={formik.touched.facilities && Boolean(formik.errors.facilities)}
                >
                  {facilities.map((facility) => (
                    <MenuItem key={facility} value={facility}>
                      {facility}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="openingTime"
                name="openingTime"
                label="Opening Time"
                type="time"
                value={formik.values.openingTime}
                onChange={formik.handleChange}
                error={formik.touched.openingTime && Boolean(formik.errors.openingTime)}
                helperText={formik.touched.openingTime && formik.errors.openingTime}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="closingTime"
                name="closingTime"
                label="Closing Time"
                type="time"
                value={formik.values.closingTime}
                onChange={formik.handleChange}
                error={formik.touched.closingTime && Boolean(formik.errors.closingTime)}
                helperText={formik.touched.closingTime && formik.errors.closingTime}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="pricePerDay"
                name="pricePerDay"
                label="Price per Day"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                value={formik.values.pricePerDay}
                onChange={formik.handleChange}
                error={formik.touched.pricePerDay && Boolean(formik.errors.pricePerDay)}
                helperText={formik.touched.pricePerDay && formik.errors.pricePerDay}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="pricePerWeek"
                name="pricePerWeek"
                label="Price per Week"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                value={formik.values.pricePerWeek}
                onChange={formik.handleChange}
                error={formik.touched.pricePerWeek && Boolean(formik.errors.pricePerWeek)}
                helperText={formik.touched.pricePerWeek && formik.errors.pricePerWeek}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="pricePerMonth"
                name="pricePerMonth"
                label="Price per Month"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                value={formik.values.pricePerMonth}
                onChange={formik.handleChange}
                error={formik.touched.pricePerMonth && Boolean(formik.errors.pricePerMonth)}
                helperText={formik.touched.pricePerMonth && formik.errors.pricePerMonth}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Register Gym
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default GymRegistration;
