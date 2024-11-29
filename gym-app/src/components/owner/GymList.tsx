import React from 'react';
import { Gym } from '../../types';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper 
} from '@mui/material';

interface GymListProps {
  gyms: Gym[];
}

const GymList: React.FC<GymListProps> = ({ gyms }) => {
  return (
    <Paper elevation={3}>
      <Typography variant="h6" sx={{ p: 2 }}>My Gyms</Typography>
      {gyms.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2 }}>
          No gyms found
        </Typography>
      ) : (
        <List>
          {gyms.map((gym) => (
            <ListItem key={gym._id}>
              <ListItemText 
                primary={gym.name} 
                secondary={gym.location} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default GymList;
