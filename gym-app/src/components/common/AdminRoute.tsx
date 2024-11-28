import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Container, Typography, Alert } from '@mui/material';

interface AdminRouteProps {
  children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return (
      <Container>
        <Alert severity="error">
          <Typography>You do not have permission to access this page.</Typography>
        </Alert>
      </Container>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
