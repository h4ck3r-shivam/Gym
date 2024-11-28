import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { format } from 'date-fns';

interface Booking {
  id: string;
  className: string;
  date: string;
  time: string;
  instructor: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings }) => {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Bookings
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.className}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {format(new Date(booking.date), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.time}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{booking.instructor}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentBookings;
