import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  Person,
  FitnessCenter,
  Event,
  Close,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Instructor {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
}

interface FitnessClass {
  id: string;
  name: string;
  instructor: Instructor;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  enrolled: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: string;
  description: string;
}

interface ClassScheduleProps {
  classes: FitnessClass[];
  date: Date;
  onBookClass: (classId: string) => void;
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({
  classes,
  date,
  onBookClass,
}) => {
  const theme = useTheme();
  const [selectedClass, setSelectedClass] = useState<FitnessClass | null>(
    null
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.warning.main;
      case 'advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleOpenDetails = (fitnessClass: FitnessClass) => {
    setSelectedClass(fitnessClass);
  };

  const handleCloseDetails = () => {
    setSelectedClass(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Event sx={{ mr: 1 }} color="primary" />
        <Typography variant="h6">
          Schedule for {format(date, 'PPPP')}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {classes.map((fitnessClass) => (
          <Grid item xs={12} md={6} key={fitnessClass.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => handleOpenDetails(fitnessClass)}
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
                  <Typography variant="h6" gutterBottom>
                    {fitnessClass.name}
                  </Typography>
                  <Chip
                    label={fitnessClass.level}
                    size="small"
                    sx={{
                      bgcolor: getLevelColor(fitnessClass.level),
                      color: 'white',
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <AccessTime
                    fontSize="small"
                    sx={{ mr: 1 }}
                    color="action"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(fitnessClass.startTime), 'h:mm a')} -{' '}
                    {format(new Date(fitnessClass.endTime), 'h:mm a')} (
                    {fitnessClass.duration} min)
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Person
                    fontSize="small"
                    sx={{ mr: 1 }}
                    color="action"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {fitnessClass.enrolled}/{fitnessClass.capacity} spots
                    filled
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={fitnessClass.instructor.avatar}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography variant="body2">
                    {fitnessClass.instructor.name}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedClass)}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        {selectedClass && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {selectedClass.name}
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDetails}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<FitnessCenter />}
                  label={selectedClass.type}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={selectedClass.level}
                  sx={{
                    bgcolor: getLevelColor(selectedClass.level),
                    color: 'white',
                  }}
                />
              </Box>

              <Typography variant="body1" paragraph>
                {selectedClass.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Time
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1 }} fontSize="small" />
                    <Typography variant="body2">
                      {format(
                        new Date(selectedClass.startTime),
                        'h:mm a'
                      )}{' '}
                      -{' '}
                      {format(
                        new Date(selectedClass.endTime),
                        'h:mm a'
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Duration
                  </Typography>
                  <Typography variant="body2">
                    {selectedClass.duration} minutes
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Instructor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={selectedClass.instructor.avatar}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {selectedClass.instructor.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {selectedClass.instructor.specialization}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Class Capacity
                </Typography>
                <Typography variant="body2">
                  {selectedClass.enrolled} enrolled out of{' '}
                  {selectedClass.capacity} spots
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => {
                  onBookClass(selectedClass.id);
                  handleCloseDetails();
                }}
                disabled={
                  selectedClass.enrolled >= selectedClass.capacity
                }
              >
                {selectedClass.enrolled >= selectedClass.capacity
                  ? 'Class Full'
                  : 'Book Class'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ClassSchedule;
