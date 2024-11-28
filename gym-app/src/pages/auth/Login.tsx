import React, { useEffect } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const Login = () => {
  const { login, currentUser, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
    return () => {
      clearError();
    };
  }, [currentUser, navigate, from, clearError]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
      } catch (err) {
        console.error('Login failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login to GymFlex
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
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              autoComplete="current-password"
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={formik.isSubmitting}
              sx={{ mt: 3 }}
            >
              {formik.isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register">
                Sign up
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link component={RouterLink} to="/forgot-password">
                Forgot your password?
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
