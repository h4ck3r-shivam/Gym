import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Badge,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Event,
} from '@mui/icons-material';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'class' | 'personal' | 'appointment';
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDateSelect,
  selectedDate,
}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const daysInWeek = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getEventCountForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.start), date))
      .length;
  };

  const getDayColor = (date: Date) => {
    if (selectedDate && isSameDay(date, selectedDate)) {
      return theme.palette.primary.main;
    }
    if (!isSameMonth(date, currentDate)) {
      return theme.palette.text.disabled;
    }
    return theme.palette.text.primary;
  };

  const renderEventBadge = (date: Date) => {
    const eventCount = getEventCountForDate(date);
    if (eventCount === 0) return null;

    return (
      <Badge
        color="primary"
        badgeContent={eventCount}
        max={9}
        sx={{
          '& .MuiBadge-badge': {
            right: -3,
            top: 3,
          },
        }}
      >
        <Event color="action" fontSize="small" />
      </Badge>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Grid container spacing={1}>
        {weekDays.map((day) => (
          <Grid item xs key={day}>
            <Typography
              variant="subtitle2"
              align="center"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {day}
            </Typography>
          </Grid>
        ))}

        {Array.from({ length: getDay(startDate) }).map((_, index) => (
          <Grid item xs key={`empty-${index}`} />
        ))}

        {daysInWeek.map((date) => {
          const isToday = isSameDay(date, new Date());
          const isSelected = selectedDate && isSameDay(date, selectedDate);

          return (
            <Grid item xs key={date.toISOString()}>
              <Tooltip
                title={format(date, 'PPPP')}
                placement="top"
                arrow
              >
                <Box
                  onClick={() => onDateSelect(date)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    position: 'relative',
                    bgcolor: isSelected
                      ? 'primary.main'
                      : isToday
                      ? 'action.selected'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: isSelected
                        ? 'primary.dark'
                        : 'action.hover',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: isSelected
                        ? 'common.white'
                        : getDayColor(date),
                    }}
                  >
                    {format(date, 'd')}
                  </Typography>
                  {renderEventBadge(date)}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default Calendar;
