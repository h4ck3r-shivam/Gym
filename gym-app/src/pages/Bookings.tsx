import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Event,
  LocationOn,
  AccessTime,
  Cancel,
  Star,
  Edit,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bookings-tabpanel-${index}`}
      aria-labelledby={`bookings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data - replace with API calls
const mockBookings = [
  {
    id: '1',
    className: 'Morning Yoga',
    gymName: 'Fitness Plus',
    location: '123 Main St, City',
    instructor: 'Sarah Johnson',
    date: '2024-01-22',
    time: '08:00 AM',
    status: 'upcoming',
    price: 25,
  },
  {
    id: '2',
    className: 'HIIT Workout',
    gymName: 'PowerGym',
    location: '456 Oak St, City',
    instructor: 'Mike Peters',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'completed',
    price: 30,
  },
  {
    id: '3',
    className: 'Spin Class',
    gymName: 'Fitness Plus',
    location: '123 Main St, City',
    instructor: 'Emma Davis',
    date: '2024-01-19',
    time: '04:30 PM',
    status: 'completed',
    price: 28,
  },
];

const Bookings: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(0);
  const [reviewText, setReviewText] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenReviewDialog = (booking: any) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setSelectedBooking(null);
    setRating(0);
    setReviewText('');
    setReviewDialogOpen(false);
  };

  const handleSubmitReview = () => {
    // Implement review submission logic
    console.log('Submitting review:', {
      bookingId: selectedBooking?.id,
      rating,
      reviewText,
    });
    handleCloseReviewDialog();
  };

  const handleOpenCancelDialog = (booking: any) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setSelectedBooking(null);
    setCancelDialogOpen(false);
  };

  const handleCancelBooking = () => {
    // Implement booking cancellation logic
    console.log('Cancelling booking:', selectedBooking?.id);
    handleCloseCancelDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return theme.palette.info.main;
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const filteredBookings = mockBookings.filter((booking) => {
    if (tabValue === 0) return booking.status === 'upcoming';
    if (tabValue === 1) return booking.status === 'completed';
    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              bgcolor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            <Typography variant="h4" gutterBottom>
              My Bookings
            </Typography>
            <Typography variant="subtitle1">
              Manage your class bookings and reviews
            </Typography>
          </Paper>
        </Grid>

        {/* Booking Stats */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Upcoming Classes</Typography>
              </Box>
              <Typography variant="h3" component="div">
                2
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Classes Attended</Typography>
              </Box>
              <Typography variant="h3" component="div">
                15
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Hours Trained</Typography>
              </Box>
              <Typography variant="h3" component="div">
                24
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bookings List */}
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="booking tabs"
            >
              <Tab label="Upcoming" />
              <Tab label="Past Classes" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <List>
                {filteredBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">{booking.className}</Typography>
                            <Chip
                              size="small"
                              label={booking.status}
                              sx={{ bgcolor: getStatusColor(booking.status) }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationOn fontSize="small" color="action" />
                              <Typography variant="body2">
                                {booking.gymName} • {booking.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <AccessTime fontSize="small" color="action" />
                              <Typography variant="body2">
                                {format(new Date(booking.date), 'PPP')} at {booking.time}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleOpenCancelDialog(booking)}
                        >
                          Cancel
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <List>
                {filteredBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">{booking.className}</Typography>
                            <Chip
                              size="small"
                              label={booking.status}
                              sx={{ bgcolor: getStatusColor(booking.status) }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationOn fontSize="small" color="action" />
                              <Typography variant="body2">
                                {booking.gymName} • {booking.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <AccessTime fontSize="small" color="action" />
                              <Typography variant="body2">
                                {format(new Date(booking.date), 'PPP')} at {booking.time}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => handleOpenReviewDialog(booking)}
                        >
                          Review
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < filteredBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review Class</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
              How would you rate your experience?
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={!rating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </Typography>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedBooking.className}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(selectedBooking.date), 'PPP')} at{' '}
                {selectedBooking.time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Keep Booking</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;
