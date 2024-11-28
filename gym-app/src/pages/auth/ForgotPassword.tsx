import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { authAPI } from '../../services/api';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError(null);
        await authAPI.forgotPassword(values.email);
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to send reset email');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Check Your Email
            </Typography>
            <Typography align="center" paragraph>
              We've sent password reset instructions to your email address.
            </Typography>
            <Typography align="center" variant="body2">
              Didn't receive the email?{' '}
              <Link
                component="button"
                onClick={() => {
                  setSuccess(false);
                  formik.submitForm();
                }}
              >
                Click here to resend
              </Link>
            </Typography>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link component={RouterLink} to="/login">
                Back to Login
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you instructions to reset your
            password.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              autoComplete="email"
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={formik.isSubmitting}
              sx={{ mt: 3 }}
            >
              {formik.isSubmitting ? 'Sending...' : 'Reset Password'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login">
              Back to Login
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
