import React from 'react';
import { Booking } from '../../types';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper 
} from '@mui/material';

interface BookingListProps {
  bookings: Booking[];
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  return (
    <Paper elevation={3}>
      <Typography variant="h6" sx={{ p: 2 }}>My Bookings</Typography>
      {bookings.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2 }}>
          No bookings found
        </Typography>
      ) : (
        <List>
          {bookings.map((booking) => (
            <ListItem key={booking._id}>
              <ListItemText 
                primary={`Booking at ${booking.gymId}`} 
                secondary={`Status: ${booking.status}`} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default BookingList;
