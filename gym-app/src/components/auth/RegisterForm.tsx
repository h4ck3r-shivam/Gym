import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().oneOf(['user', 'owner']).required('Role is required'),
  phone: Yup.string().required('Phone number is required'),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      phone: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        await register({
          ...values,
          role: values.role as UserRole,
        });
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'grey.100',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          mx: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Create Your Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </Box>

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            sx={{ mb: 2 }}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            sx={{ mb: 2 }}
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            sx={{ mb: 2 }}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            sx={{ mb: 2 }}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Account Type</FormLabel>
            <RadioGroup
              row
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="user" control={<Radio />} label="Member" />
              <FormControlLabel value="owner" control={<Radio />} label="Gym Owner" />
            </RadioGroup>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>

          <Typography align="center" color="text.secondary">
            Already have an account?{' '}
            <Button color="primary" onClick={() => navigate('/login')}>
              Login
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
