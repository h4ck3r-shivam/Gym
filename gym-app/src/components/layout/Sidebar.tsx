import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FitnessCenter as GymIcon,
  Event as BookingIcon,
  Settings as SettingsIcon,
  RateReview as ReviewIcon,
  Notifications as NotificationIcon,
  Analytics as AnalyticsIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavItems = () => {
    const items = [
      {
        text: 'Profile',
        icon: <ProfileIcon />,
        path: '/profile',
        roles: ['user', 'owner', 'admin'],
      },
    ];

    if (currentUser?.role === 'user') {
      items.push(
        {
          text: 'Find Gyms',
          icon: <GymIcon />,
          path: '/gyms',
          roles: ['user'],
        },
        {
          text: 'My Bookings',
          icon: <BookingIcon />,
          path: '/bookings',
          roles: ['user'],
        },
        {
          text: 'My Reviews',
          icon: <ReviewIcon />,
          path: '/reviews',
          roles: ['user'],
        }
      );
    }

    if (currentUser?.role === 'owner') {
      items.push(
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          path: '/owner/dashboard',
          roles: ['owner'],
        },
        {
          text: 'Bookings',
          icon: <BookingIcon />,
          path: '/owner/bookings',
          roles: ['owner'],
        },
        {
          text: 'Analytics',
          icon: <AnalyticsIcon />,
          path: '/owner/analytics',
          roles: ['owner'],
        }
      );
    }

    if (currentUser?.role === 'admin') {
      items.push(
        {
          text: 'Dashboard',
          icon: <DashboardIcon />,
          path: '/admin/dashboard',
          roles: ['admin'],
        },
        {
          text: 'Users',
          icon: <ProfileIcon />,
          path: '/admin/users',
          roles: ['admin'],
        },
        {
          text: 'Analytics',
          icon: <AnalyticsIcon />,
          path: '/admin/analytics',
          roles: ['admin'],
        }
      );
    }

    items.push(
      {
        text: 'Notifications',
        icon: <NotificationIcon />,
        path: '/notifications',
        roles: ['user', 'owner', 'admin'],
      },
      {
        text: 'Settings',
        icon: <SettingsIcon />,
        path: '/settings',
        roles: ['user', 'owner', 'admin'],
      }
    );

    return items.filter(item => item.roles.includes(currentUser?.role || ''));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!currentUser) return null;

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="div">
            {currentUser.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
          </Typography>
        </Box>
        <Divider />
        <List>
          {getNavItems().map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
