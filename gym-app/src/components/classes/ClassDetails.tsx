import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Button,
  Divider,
  Rating,
} from '@mui/material';
import {
  AccessTime,
  Person,
  FitnessCenter,
  Event,
  LocationOn,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface ClassDetailsProps {
  classData: {
    id: string;
    name: string;
    description: string;
    image: string;
    instructor: {
      id: string;
      name: string;
      image?: string;
      rating: number;
      specialties: string[];
    };
    date: string;
    time: string;
    duration: number;
    type: string;
    level: string;
    capacity: number;
    enrolled: number;
    location: string;
    requirements: string[];
    equipment: string[];
  };
  onBook: () => void;
  isBooked: boolean;
}

const ClassDetails: React.FC<ClassDetailsProps> = ({
  classData,
  onBook,
  isBooked,
}) => {
  const availableSpots = classData.capacity - classData.enrolled;

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box
            component="img"
            src={classData.image}
            alt={classData.name}
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3,
            }}
          />

          <Typography variant="h4" gutterBottom>
            {classData.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip label={classData.type} color="primary" />
            <Chip label={classData.level} variant="outlined" />
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Event sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {format(new Date(classData.date), 'MMMM dd, yyyy')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {classData.time} ({classData.duration} min)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {availableSpots} spots left
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography color="text.secondary">
              {classData.description}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {classData.requirements.map((req) => (
                <Chip key={req} label={req} variant="outlined" size="small" />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Equipment
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {classData.equipment.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  variant="outlined"
                  size="small"
                  icon={<FitnessCenter />}
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ p: 3, bgcolor: 'background.default', mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {classData.location}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={onBook}
              disabled={isBooked || availableSpots === 0}
            >
              {isBooked
                ? 'Already Booked'
                : availableSpots > 0
                ? 'Book Now'
                : 'Class Full'}
            </Button>
          </Paper>

          <Paper
            elevation={0}
            sx={{ p: 3, bgcolor: 'background.default' }}
          >
            <Typography variant="h6" gutterBottom>
              Instructor
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar
                src={classData.instructor.image}
                sx={{ width: 64, height: 64 }}
              >
                {classData.instructor.name[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {classData.instructor.name}
                </Typography>
                <Rating
                  value={classData.instructor.rating}
                  readOnly
                  size="small"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {classData.instructor.specialties.map((specialty) => (
                <Chip
                  key={specialty}
                  label={specialty}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ClassDetails;
