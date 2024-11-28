import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Tab,
  Tabs,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person,
  FitnessCenter,
  EventNote,
  Star,
  AccessTime,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, bookingAPI } from '../../services/api';
import { format } from 'date-fns';
import { Booking } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ProfileDashboard = () => {
  const { currentUser } = useAuth();
  const [value, setValue] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.data.bookings);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
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
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mb: 2,
                  }}
                >
                  {currentUser?.firstName?.[0]}
                  {currentUser?.lastName?.[0]}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {currentUser?.firstName} {currentUser?.lastName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {currentUser?.email}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Person />}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleTabChange}>
                <Tab icon={<EventNote />} label="Bookings" />
                <Tab icon={<FitnessCenter />} label="Memberships" />
                <Tab icon={<Star />} label="Reviews" />
              </Tabs>
            </Box>

            {/* Bookings Tab */}
            <TabPanel value={value} index={0}>
              <List>
                {bookings.map((booking, index) => (
                  <React.Fragment key={booking._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary">
                            {booking.gym.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AccessTime sx={{ fontSize: 'small', mr: 1 }} />
                              <Typography variant="body2">
                                {format(new Date(booking.startDate), 'PPP')} at{' '}
                                {format(new Date(booking.slot.startTime), 'p')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                size="small"
                                label={booking.status}
                                color={getStatusColor(booking.status) as any}
                              />
                              <Chip
                                size="small"
                                label={`₹${booking.amount}`}
                                variant="outlined"
                              />
                              <Chip
                                size="small"
                                label={booking.plan}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < bookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {bookings.length === 0 && (
                  <Typography color="textSecondary" align="center">
                    No bookings found
                  </Typography>
                )}
              </List>
            </TabPanel>

            {/* Memberships Tab */}
            <TabPanel value={value} index={1}>
              <Typography color="textSecondary" align="center">
                No active memberships
              </Typography>
            </TabPanel>

            {/* Reviews Tab */}
            <TabPanel value={value} index={2}>
              <Typography color="textSecondary" align="center">
                You haven't written any reviews yet
              </Typography>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileDashboard;
