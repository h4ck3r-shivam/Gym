import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { Cancel as CancelIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import { bookingAPI } from '../../services/api';
import { Booking, BookingStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { exportToCSV } from '../../utils/export';

const ITEMS_PER_PAGE = 10;

const MyBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const response = await bookingAPI.getMyBookings({
          page,
          limit: ITEMS_PER_PAGE,
          startDate: dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : undefined,
          endDate: dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : undefined,
        });
        setBookings(response.data.data.bookings);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, page, dateRange]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      const fetchBookings = async () => {
        if (!currentUser) return;
        
        try {
          setLoading(true);
          const response = await bookingAPI.getMyBookings({
            page,
            limit: ITEMS_PER_PAGE,
            startDate: dateRange.start ? format(dateRange.start, 'yyyy-MM-dd') : undefined,
            endDate: dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : undefined,
          });
          setBookings(response.data.data.bookings);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch bookings');
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleExport = () => {
    const formatBookingData = (booking: Booking) => {
      const gym = typeof booking.gym === 'string' ? { name: booking.gym } : booking.gym;
      const slot = typeof booking.slot === 'string' ? { startTime: booking.slot, endTime: booking.slot } : booking.slot;

      return {
        'Booking ID': booking._id,
        'Gym Name': gym.name,
        'Date': format(new Date(booking.date), 'dd/MM/yyyy'),
        'Time': `${slot.startTime} - ${slot.endTime}`,
        'Status': booking.status,
        'Amount Paid': `₹${booking.amount}`,
      };
    };

    const data = bookings.map(formatBookingData);
    exportToCSV(data, `bookings-${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'cancelled':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <DatePicker
            label="Start Date"
            value={dateRange.start}
            onChange={(date) => setDateRange((prev) => ({ ...prev, start: date }))}
          />
          <DatePicker
            label="End Date"
            value={dateRange.end}
            onChange={(date) => setDateRange((prev) => ({ ...prev, end: date }))}
          />
          <Tooltip title="Export Bookings">
            <IconButton onClick={handleExport} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Gym</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => {
                const gym = typeof booking.gym === 'string' ? { name: booking.gym } : booking.gym;
                const slot = typeof booking.slot === 'string' ? { startTime: booking.slot, endTime: booking.slot } : booking.slot;

                return (
                  <TableRow key={booking._id}>
                    <TableCell>{gym.name}</TableCell>
                    <TableCell>{format(new Date(booking.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      {slot.startTime} - {slot.endTime}
                    </TableCell>
                    <TableCell>
                      <Typography color={getStatusColor(booking.status)}>
                        {booking.status.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>₹{booking.amount}</TableCell>
                    <TableCell>
                      {booking.status === 'confirmed' && (
                        <Tooltip title="Cancel Booking">
                          <IconButton
                            onClick={() => handleCancelBooking(booking._id)}
                            color="error"
                            size="small"
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(bookings.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default MyBookings;
