import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  TablePagination,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format, isValid } from 'date-fns';
import { GetApp as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { bookingAPI } from '../../services/api';
import { Booking, BookingStatus, PaymentStatus } from '../../types';
import { exportToCSV } from '../../utils/export';
import { useDebounce } from '../../hooks/useDebounce';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

interface FilterParams {
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  gymId?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState<FilterParams>({});

  const fetchBookingsData = useCallback(async () => {
    try {
      setLoading(true);
      const params: FilterParams = {
        ...filters,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        gymId: filters.gymId || undefined,
      };
      const { bookings, total } = await bookingAPI.fetchBookings(
        pagination.page, 
        pagination.limit, 
        params
      );
      setBookings(bookings);
      setPagination(prev => ({ ...prev, total }));
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchBookingsData();
  }, [fetchBookingsData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({ ...prev, limit: parseInt(event.target.value, 10), page: 1 }));
  };

  const handleFilterChange = (field: keyof FilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleExport = () => {
    const data = bookings.map(booking => ({
      'Booking ID': booking._id,
      'User': typeof booking.user === 'string' ? booking.user : `${booking.user.firstName} ${booking.user.lastName}`,
      'Gym': typeof booking.gym === 'string' ? booking.gym : booking.gym.name,
      'Date': format(new Date(booking.date), 'dd/MM/yyyy'),
      'Plan': booking.plan,
      'Status': booking.status,
      'Payment Status': booking.paymentStatus,
      'Amount': booking.amount,
      'Created At': format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm'),
    }));
    exportToCSV(data, `bookings-${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const getStatusColor = (status: BookingStatus | PaymentStatus) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'cancelled':
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Booking Management
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by ID, user, or gym"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Payment Status"
                value={filters.paymentStatus || ''}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Start Date"
                value={filters.startDate ? new Date(filters.startDate) : null}
                onChange={(date: Date | null) => handleFilterChange('startDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="End Date"
                value={filters.endDate ? new Date(filters.endDate) : null}
                onChange={(date: Date | null) => handleFilterChange('endDate', date ? format(date, 'yyyy-MM-dd') : undefined)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Export Data">
                  <IconButton onClick={handleExport} color="primary">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <IconButton onClick={fetchBookingsData} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Bookings Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Gym</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking._id}</TableCell>
                    <TableCell>
                      {typeof booking.user === 'string'
                        ? booking.user
                        : `${booking.user.firstName} ${booking.user.lastName}`}
                    </TableCell>
                    <TableCell>
                      {typeof booking.gym === 'string' ? booking.gym : booking.gym.name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{booking.plan}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.paymentStatus}
                        color={getStatusColor(booking.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₹{booking.amount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={pagination.total}
            rowsPerPage={pagination.limit}
            page={pagination.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default BookingManagement;
