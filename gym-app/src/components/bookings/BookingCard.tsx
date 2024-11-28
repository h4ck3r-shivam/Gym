import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Person,
  Event,
  CalendarToday,
  Cancel,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: {
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
  };
  onCancel?: () => void;
  onReschedule?: () => void;
  onAddToCalendar?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onReschedule,
  onAddToCalendar,
}) => {
  const isUpcoming = booking.status === 'upcoming';
  const isCancelled = booking.status === 'cancelled';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isCancelled ? 0.7 : 1,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              {booking.classInfo.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label={booking.classInfo.type}
                size="small"
                color="primary"
              />
              <Chip
                label={booking.classInfo.level}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
          <Chip
            label={booking.status}
            color={
              booking.status === 'upcoming'
                ? 'primary'
                : booking.status === 'completed'
                ? 'success'
                : 'default'
            }
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Person sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {booking.classInfo.instructor}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Event sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <AccessTime
              sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }}
            />
            <Typography variant="body2" color="text.secondary">
              {booking.time} ({booking.duration} min)
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LocationOn
              sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }}
            />
            <Typography variant="body2" color="text.secondary">
              {booking.location}
            </Typography>
          </Box>
        </Box>

        {isUpcoming && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Tooltip title="Add to Calendar">
                <IconButton
                  size="small"
                  onClick={onAddToCalendar}
                  color="primary"
                >
                  <CalendarToday />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<Cancel />}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={onReschedule}
              >
                Reschedule
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
