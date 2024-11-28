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
  Avatar,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  Pagination,
} from '@mui/material';
import {
  Search,
  Instagram,
  LinkedIn,
  Email,
  FitnessCenter,
  SportsGymnastics,
  Pool,
  DirectionsRun,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock data - replace with API calls
const mockInstructors = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: '/instructor1.jpg',
    rating: 4.8,
    reviewCount: 156,
    specialties: ['Yoga', 'Pilates', 'Meditation'],
    experience: '5+ years',
    bio: 'Certified yoga instructor specializing in Vinyasa and Hatha yoga. Passionate about helping others achieve their wellness goals.',
    availability: 'Mon-Fri',
    social: {
      instagram: 'sarah.yoga',
      linkedin: 'sarahjohnson',
      email: 'sarah@example.com',
    },
    certifications: ['RYT-200', 'Pilates Certification'],
    gym: 'Fitness Plus',
  },
  {
    id: '2',
    name: 'Mike Peters',
    image: '/instructor2.jpg',
    rating: 4.9,
    reviewCount: 203,
    specialties: ['HIIT', 'Strength Training', 'CrossFit'],
    experience: '8+ years',
    bio: 'Former professional athlete turned fitness coach. Specializes in high-intensity workouts and strength training.',
    availability: 'Mon-Sat',
    social: {
      instagram: 'mike.fitness',
      linkedin: 'mikepeters',
      email: 'mike@example.com',
    },
    certifications: ['NASM-CPT', 'CrossFit Level 2'],
    gym: 'PowerGym',
  },
  // Add more mock instructors
];

const specialties = [
  'All',
  'Yoga',
  'Pilates',
  'HIIT',
  'Strength Training',
  'CrossFit',
  'Swimming',
  'Cardio',
];

const Instructors: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleSpecialtyChange = (event: SelectChangeEvent) => {
    setSelectedSpecialty(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Filter instructors based on search query and specialty
  const filteredInstructors = mockInstructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'All' ||
      instructor.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
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
              Our Instructors
            </Typography>
            <Typography variant="subtitle1">
              Meet our team of expert fitness professionals
            </Typography>
          </Paper>
        </Grid>

        {/* Search and Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search instructors..."
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    value={selectedSpecialty}
                    label="Specialty"
                    onChange={handleSpecialtyChange}
                  >
                    {specialties.map((specialty) => (
                      <MenuItem key={specialty} value={specialty}>
                        {specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Instructor Cards */}
        {paginatedInstructors.map((instructor) => (
          <Grid item xs={12} sm={6} md={4} key={instructor.id}>
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={instructor.image}
                    alt={instructor.name}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom align="center">
                    {instructor.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      value={instructor.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({instructor.reviewCount} reviews)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {instructor.specialties.map((specialty, index) => (
                    <Chip key={index} label={specialty} size="small" />
                  ))}
                </Box>

                <Typography variant="body2" paragraph>
                  {instructor.bio}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Experience: {instructor.experience}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <IconButton
                    size="small"
                    component="a"
                    href={`https://instagram.com/${instructor.social.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton
                    size="small"
                    component="a"
                    href={`https://linkedin.com/in/${instructor.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedIn />
                  </IconButton>
                  <IconButton
                    size="small"
                    component="a"
                    href={`mailto:${instructor.social.email}`}
                  >
                    <Email />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Available: {instructor.availability}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  At: {instructor.gym}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to={`/instructors/${instructor.id}`}
                  variant="contained"
                  fullWidth
                >
                  View Schedule
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

export default Instructors;
