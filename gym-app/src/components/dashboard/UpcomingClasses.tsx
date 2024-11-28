import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Button,
  Box,
} from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';
import { format } from 'date-fns';

interface Class {
  id: string;
  name: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  availableSpots: number;
}

interface UpcomingClassesProps {
  classes: Class[];
  onBookClass: (classId: string) => void;
}

const UpcomingClasses: React.FC<UpcomingClassesProps> = ({
  classes,
  onBookClass,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Classes
      </Typography>
      <List>
        {classes.map((classItem, index) => (
          <React.Fragment key={classItem.id}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onBookClass(classItem.id)}
                  disabled={classItem.availableSpots === 0}
                >
                  Book Now
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FitnessCenter />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={classItem.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {classItem.instructor}
                    </Typography>
                    <Box component="span" sx={{ display: 'block' }}>
                      {format(new Date(classItem.date), 'MMM dd, yyyy')} at{' '}
                      {classItem.time} ({classItem.duration} min)
                    </Box>
                    <Box component="span" sx={{ display: 'block' }}>
                      {classItem.availableSpots} spots available
                    </Box>
                  </React.Fragment>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default UpcomingClasses;
