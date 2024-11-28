import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Rating,
  IconButton,
  useTheme,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search,
  FilterList,
  AccessTime,
  Person,
  FitnessCenter,
  Pool,
  DirectionsRun,
  SportsGymnastics,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Mock data - replace with API calls
const mockClasses = [
  {
    id: '1',
    name: 'Morning Yoga',
    instructor: {
      name: 'Sarah Johnson',
      image: '/instructor1.jpg',
      rating: 4.8,
    },
    type: 'Yoga',
    level: 'Beginner',
    duration: 60,
    capacity: 20,
    enrolled: 15,
    time: '08:00 AM',
    date: '2024-01-22',
    description:
      'Start your day with energizing yoga poses and breathing exercises.',
    location: 'Studio A',
    gym: 'Fitness Plus',
  },
  {
    id: '2',
    name: 'HIIT Workout',
    instructor: {
      name: 'Mike Peters',
      image: '/instructor2.jpg',
      rating: 4.9,
    },
    type: 'HIIT',
    level: 'Advanced',
    duration: 45,
    capacity: 15,
    enrolled: 12,
    time: '10:00 AM',
    date: '2024-01-22',
    description:
      'High-intensity interval training to boost your metabolism and strength.',
    location: 'Main Floor',
    gym: 'PowerGym',
  },
  // Add more mock classes
];

const classTypes = ['All', 'Yoga', 'HIIT', 'Pilates', 'Strength', 'Cardio', 'Swimming'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Classes: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setSelectedType(event.target.value);
    setPage(1);
  };

  const handleLevelChange = (event: SelectChangeEvent) => {
    setSelectedLevel(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Filter classes based on search query and filters
  const filteredClasses = mockClasses.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === 'All' || classItem.type === selectedType;
    const matchesLevel =
      selectedLevel === 'All' || classItem.level === selectedLevel;
    return matchesSearch && matchesType && matchesLevel;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
              Fitness Classes
            </Typography>
            <Typography variant="subtitle1">
              Find and book your next workout session
            </Typography>
          </Paper>
        </Grid>

        {/* Search and Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search classes or instructors..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Class Type</InputLabel>
                  <Select
                    value={selectedType}
                    label="Class Type"
                    onChange={handleTypeChange}
                  >
                    {classTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={selectedLevel}
                    label="Level"
                    onChange={handleLevelChange}
                  >
                    {levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Class Cards */}
        {paginatedClasses.map((classItem) => (
          <Grid item xs={12} sm={6} md={4} key={classItem.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    {classItem.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      size="small"
                      label={classItem.type}
                      color="primary"
                    />
                    <Chip
                      size="small"
                      label={classItem.level}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={classItem.instructor.image}
                    alt={classItem.instructor.name}
                    sx={{ mr: 1 }}
                  />
                  <Box>
                    <Typography variant="subtitle2">
                      {classItem.instructor.name}
                    </Typography>
                    <Rating
                      value={classItem.instructor.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                  </Box>
                </Box>

                <Typography variant="body2" paragraph>
                  {classItem.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime
                    fontSize="small"
                    sx={{ color: 'text.secondary', mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(classItem.date), 'PPP')} at {classItem.time} ({classItem.duration} min)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person
                    fontSize="small"
                    sx={{ color: 'text.secondary', mr: 0.5 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {classItem.enrolled}/{classItem.capacity} spots filled
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {classItem.location} at {classItem.gym}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to={`/classes/${classItem.id}`}
                  variant="contained"
                  fullWidth
                  disabled={classItem.enrolled >= classItem.capacity}
                >
                  {classItem.enrolled >= classItem.capacity
                    ? 'Class Full'
                    : 'Book Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Classes;
