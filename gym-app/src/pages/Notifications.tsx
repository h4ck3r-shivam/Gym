import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Chip,
  Divider,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Event,
  Person,
  Payment,
  Info,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data - replace with API calls
const mockNotifications = [
  {
    id: '1',
    type: 'booking',
    title: 'Class Booking Confirmed',
    message: 'Your booking for Morning Yoga on January 22nd has been confirmed.',
    timestamp: '2024-01-20T10:00:00Z',
    status: 'unread',
    priority: 'normal',
    icon: Event,
    action: {
      label: 'View Booking',
      link: '/bookings',
    },
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your monthly membership payment has been processed successfully.',
    timestamp: '2024-01-19T15:30:00Z',
    status: 'read',
    priority: 'low',
    icon: Payment,
    action: {
      label: 'View Receipt',
      link: '/payments',
    },
  },
  {
    id: '3',
    type: 'instructor',
    title: 'Class Cancellation',
    message: 'Your HIIT class scheduled for tomorrow has been cancelled.',
    timestamp: '2024-01-19T09:15:00Z',
    status: 'unread',
    priority: 'high',
    icon: Person,
    action: {
      label: 'Reschedule',
      link: '/classes',
    },
  },
  // Add more notifications
];

const Notifications: React.FC = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(
    null
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    notificationId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, status: 'read' }
          : notification
      )
    );
    handleMenuClose();
  };

  const handleDelete = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
    handleMenuClose();
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, status: 'read' }))
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'normal':
        return theme.palette.info.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Error color="error" />;
      case 'normal':
        return <Info color="info" />;
      case 'low':
        return <CheckCircle color="success" />;
      default:
        return <Info />;
    }
  };

  const unreadCount = notifications.filter(
    (notification) => notification.status === 'unread'
  ).length;

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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Notifications
                </Typography>
                <Typography variant="subtitle1">
                  Stay updated with your fitness journey
                </Typography>
              </Box>
              {unreadCount > 0 && (
                <Chip
                  label={`${unreadCount} unread`}
                  color="secondary"
                  sx={{ color: 'white' }}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Notifications List */}
        <Grid item xs={12}>
          <Paper>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </Button>
            </Box>

            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor:
                        notification.status === 'unread'
                          ? 'action.hover'
                          : 'inherit',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: getPriorityColor(notification.priority),
                        }}
                      >
                        {getPriorityIcon(notification.priority)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight:
                                notification.status === 'unread' ? 600 : 400,
                            }}
                          >
                            {notification.title}
                          </Typography>
                          {notification.status === 'unread' && (
                            <Chip
                              label="New"
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {notification.message}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {format(
                                new Date(notification.timestamp),
                                'PPp'
                              )}
                            </Typography>
                            {notification.action && (
                              <Button
                                size="small"
                                href={notification.action.link}
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <IconButton
                      edge="end"
                      onClick={(e) =>
                        handleMenuOpen(e, notification.id)
                      }
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>

            {notifications.length === 0 && (
              <Box
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <NotificationsIcon
                  sx={{
                    fontSize: 48,
                    color: 'text.secondary',
                    mb: 2,
                  }}
                />
                <Typography variant="h6" color="text.secondary">
                  No notifications
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  You're all caught up! Check back later for updates.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && (
          <>
            <MenuItem
              onClick={() => handleMarkAsRead(selectedNotification)}
              disabled={
                notifications.find(
                  (n) => n.id === selectedNotification
                )?.status === 'read'
              }
            >
              Mark as Read
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedNotification)}>
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Container>
  );
};

export default Notifications;
