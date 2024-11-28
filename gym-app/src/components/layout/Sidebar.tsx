import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  FitnessCenter,
  Event,
  People,
  Person,
  Settings,
  CreditCard,
  Notifications,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Gyms', icon: <FitnessCenter />, path: '/gyms' },
    { text: 'Classes', icon: <Event />, path: '/classes' },
    { text: 'Bookings', icon: <Event />, path: '/bookings' },
    { text: 'Instructors', icon: <People />, path: '/instructors' },
    { text: 'Membership', icon: <CreditCard />, path: '/membership' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FitnessCenter />
        <Typography variant="h6" component="div">
          Gym App
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'white' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary">
          {currentUser?.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {currentUser?.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
