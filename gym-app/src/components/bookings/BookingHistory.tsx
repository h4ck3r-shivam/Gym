import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import BookingCard from './BookingCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Booking {
  id: string;
  classInfo: {
    name: string;
    type: string;
    level: string;
    instructor: string;
  };
  date: string;
  time: string;
  duration: number;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface BookingHistoryProps {
  bookings: Booking[];
  onCancel: (bookingId: string) => void;
  onReschedule: (bookingId: string) => void;
  onAddToCalendar: (bookingId: string) => void;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const BookingHistory: React.FC<BookingHistoryProps> = ({
  bookings,
  onCancel,
  onReschedule,
  onAddToCalendar,
}) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('');
  const [sortBy, setSortBy] = React.useState('date');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filterBookings = (status: 'upcoming' | 'completed' | 'cancelled') => {
    return bookings
      .filter((booking) => {
        const matchesStatus = booking.status === status;
        const matchesSearch = booking.classInfo.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesType = !filterType || booking.classInfo.type === filterType;
        return matchesStatus && matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
  };

  const types = Array.from(
    new Set(bookings.map((booking) => booking.classInfo.type))
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Booking History
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="booking history tabs"
        >
          <Tab label="Upcoming" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => setFilterType(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Types</MenuItem>
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="name">Class Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {filterBookings('upcoming').map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <BookingCard
                booking={booking}
                onCancel={() => onCancel(booking.id)}
                onReschedule={() => onReschedule(booking.id)}
                onAddToCalendar={() => onAddToCalendar(booking.id)}
              />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {filterBookings('completed').map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <BookingCard booking={booking} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {filterBookings('cancelled').map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <BookingCard booking={booking} />
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default BookingHistory;
