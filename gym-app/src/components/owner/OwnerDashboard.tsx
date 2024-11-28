import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  Group,
  AttachMoney,
  Event,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { gymAPI, bookingAPI } from '../../services/api';
import { Gym, Booking } from '../../types';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gymsResponse, bookingsResponse] = await Promise.all([
        gymAPI.getOwnerGyms(),
        bookingAPI.getGymBookings(),
      ]);
      setGyms(gymsResponse.data.data.gyms);
      setBookings(bookingsResponse.data.data.bookings);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getRevenueData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: format(date, 'MMM dd'),
        revenue: bookings
          .filter(
            (booking) =>
              format(new Date(booking.createdAt), 'yyyy-MM-dd') ===
              format(date, 'yyyy-MM-dd')
          )
          .reduce((sum, booking) => sum + booking.amount, 0),
      };
    }).reverse();

    return last7Days;
  };

  const getTotalRevenue = () => {
    return bookings.reduce((sum, booking) => sum + booking.amount, 0);
  };

  const getActiveBookings = () => {
    return bookings.filter((booking) => booking.status === 'confirmed').length;
  };

  const getTotalMembers = () => {
    const uniqueMembers = new Set(bookings.map((booking) => booking.user));
    return uniqueMembers.size;
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
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="overline">
              Total Revenue
            </Typography>
            <Typography component="p" variant="h4">
              ₹{getTotalRevenue()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <AttachMoney color="primary" />
              <Typography color="text.secondary" variant="caption">
                All time earnings
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="overline">
              Active Bookings
            </Typography>
            <Typography component="p" variant="h4">
              {getActiveBookings()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <Event color="primary" />
              <Typography color="text.secondary" variant="caption">
                Current period
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="overline">
              Total Members
            </Typography>
            <Typography component="p" variant="h4">
              {getTotalMembers()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <Group color="primary" />
              <Typography color="text.secondary" variant="caption">
                Unique customers
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="overline">
              Total Gyms
            </Typography>
            <Typography component="p" variant="h4">
              {gyms.length}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <TrendingUp color="primary" />
              <Typography color="text.secondary" variant="caption">
                Managed facilities
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Revenue Overview
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getRevenueData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Gyms List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Your Gyms</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/owner/gyms/new')}
            >
              Add New Gym
            </Button>
          </Box>
          <List>
            {gyms.map((gym, index) => (
              <React.Fragment key={gym._id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="view"
                        onClick={() => navigate(`/gyms/${gym._id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => navigate(`/owner/gyms/${gym._id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={gym.name}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          size="small"
                          label={`${gym.slots.length} slots`}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={`Rating: ${gym.rating}`}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < gyms.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OwnerDashboard;
