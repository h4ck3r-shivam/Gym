import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import MyBookings from './pages/user/MyBookings';
import GymRegistration from './pages/admin/GymRegistration';
import SlotManagement from './pages/admin/SlotManagement';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  
                  {/* Protected User Routes */}
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <PrivateRoute>
                        <MyBookings />
                      </PrivateRoute>
                    }
                  />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <PrivateRoute roles={['admin']}>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/gym-registration"
                    element={
                      <PrivateRoute roles={['admin', 'gym-owner']}>
                        <GymRegistration />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/slot-management"
                    element={
                      <PrivateRoute roles={['admin', 'gym-owner']}>
                        <SlotManagement />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Layout>
            </LocalizationProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
