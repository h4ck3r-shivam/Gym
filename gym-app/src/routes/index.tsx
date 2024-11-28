import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography } from '@mui/material';
import ErrorBoundary from '../components/common/ErrorBoundary';
import PrivateRoute from '../components/common/PrivateRoute';
import AdminRoute from '../components/common/AdminRoute';

// Lazy loaded components
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const GymList = lazy(() => import('../components/gyms/GymList'));
const GymDetail = lazy(() => import('../components/gyms/GymDetail'));
const GymBooking = lazy(() => import('../components/gyms/GymBooking'));
const Profile = lazy(() => import('../pages/user/Profile'));
const MyBookings = lazy(() => import('../pages/user/MyBookings'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const GymManagement = lazy(() => import('../pages/admin/GymManagement'));
const BookingManagement = lazy(() => import('../pages/admin/BookingManagement'));
const NotFound = lazy(() => import('../pages/NotFound'));

const LoadingFallback = () => (
  <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <CircularProgress />
  </Container>
);

const GymBookingWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gym = location.state?.gym as any;

  const handleSuccess = () => {
    navigate('/bookings');
  };

  if (!gym) {
    return <Navigate to="/gyms" />;
  }

  return <GymBooking gym={gym} onSuccess={handleSuccess} />;
};

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

          {/* Protected User Routes */}
          <Route path="/gyms" element={<PrivateRoute><GymList /></PrivateRoute>} />
          <Route path="/gyms/:id" element={<PrivateRoute><GymDetail /></PrivateRoute>} />
          <Route path="/gyms/:id/book" element={<PrivateRoute><GymBookingWrapper /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/gyms" element={<AdminRoute><GymManagement /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><BookingManagement /></AdminRoute>} />
          
          {/* 404 Route */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
