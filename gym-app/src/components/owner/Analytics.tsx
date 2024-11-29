import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { analyticsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Analytics: React.FC<{ gymId: string }> = ({ gymId }) => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [gymId]);

  const fetchAnalytics = async () => {
    if (!currentUser?.token) return;
    
    try {
      setLoading(true);
      const response = await analyticsAPI.getAnalytics(gymId, currentUser.token);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ₹{data.revenue.yearly}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">{data.bookings.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Bookings
              </Typography>
              <Typography variant="h4">{data.bookings.confirmed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{data.users.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Daily Revenue: ₹{data.revenue.daily}
              </Typography>
              <Typography variant="body1">
                Weekly Revenue: ₹{data.revenue.weekly}
              </Typography>
              <Typography variant="body1">
                Monthly Revenue: ₹{data.revenue.monthly}
              </Typography>
              <Typography variant="body1">
                Yearly Revenue: ₹{data.revenue.yearly}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Booking Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Total Bookings: {data.bookings.total}
              </Typography>
              <Typography variant="body1">
                Pending Bookings: {data.bookings.pending}
              </Typography>
              <Typography variant="body1">
                Confirmed Bookings: {data.bookings.confirmed}
              </Typography>
              <Typography variant="body1">
                Cancelled Bookings: {data.bookings.cancelled}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
