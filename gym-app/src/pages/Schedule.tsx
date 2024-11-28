import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  MenuItem,
  Button,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, startOfWeek } from 'date-fns';
import ClassSchedule from '../components/schedule/ClassSchedule';

// Mock data - replace with API calls
const mockClasses = [
  {
    id: '1',
    name: 'Morning Yoga',
    instructor: {
      id: 'i1',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      specialization: 'Yoga Instructor',
    },
    startTime: '2024-01-20T08:00:00',
    endTime: '2024-01-20T09:00:00',
    duration: 60,
    capacity: 20,
    enrolled: 15,
    level: 'beginner' as const,
    type: 'Yoga',
    description: 'Start your day with energizing yoga poses and meditation.',
  },
  {
    id: '2',
    name: 'HIIT Workout',
    instructor: {
      id: 'i2',
      name: 'Mike Peters',
      avatar: '/avatars/mike.jpg',
      specialization: 'Fitness Trainer',
    },
    startTime: '2024-01-20T10:00:00',
    endTime: '2024-01-20T11:00:00',
    duration: 60,
    capacity: 15,
    enrolled: 12,
    level: 'advanced' as const,
    type: 'HIIT',
    description: 'High-intensity interval training to boost your metabolism.',
  },
  // Add more mock classes as needed
];

const Schedule: React.FC = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [classType, setClassType] = useState<string>('all');
  const [level, setLevel] = useState<string>('all');

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'day' | 'week' | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleClassTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClassType(event.target.value);
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(event.target.value);
  };

  const handleBookClass = (classId: string) => {
    // Implement booking logic
    console.log('Booking class:', classId);
  };

  // Filter classes based on selected filters
  const filteredClasses = mockClasses.filter((class_) => {
    if (classType !== 'all' && class_.type !== classType) return false;
    if (level !== 'all' && class_.level !== level) return false;
    return true;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h5" gutterBottom>
                  Class Schedule
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Book your favorite classes
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue) setSelectedDate(newValue);
                  }}
                  sx={{ minWidth: 200 }}
                />

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  aria-label="view mode"
                >
                  <ToggleButton value="day" aria-label="day view">
                    Day
                  </ToggleButton>
                  <ToggleButton value="week" aria-label="week view">
                    Week
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>
          </Grid>

          {/* Filters */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Class Type"
                    value={classType}
                    onChange={handleClassTypeChange}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="Yoga">Yoga</MenuItem>
                    <MenuItem value="HIIT">HIIT</MenuItem>
                    <MenuItem value="Pilates">Pilates</MenuItem>
                    <MenuItem value="Strength">Strength Training</MenuItem>
                    <MenuItem value="Cardio">Cardio</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Level"
                    value={level}
                    onChange={handleLevelChange}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setClassType('all');
                      setLevel('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Schedule */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <ClassSchedule
                classes={filteredClasses}
                date={selectedDate}
                onBookClass={handleBookClass}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Schedule;
