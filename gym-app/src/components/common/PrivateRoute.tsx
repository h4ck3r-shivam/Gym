import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Container, Typography, Alert } from '@mui/material';

interface PrivateRouteProps {
  children?: React.ReactNode;
  roles?: ('user' | 'admin' | 'trainer')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
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

  // If roles are specified, check if user has the required role
  if (roles && roles.length > 0 && !roles.includes(currentUser.role)) {
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

export default PrivateRoute;
