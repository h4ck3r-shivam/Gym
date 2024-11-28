import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Box,
  Card,
  CardContent,
  Badge,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Event,
  Payment,
  Info,
  MoreVert,
  Check,
  Clear,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { notificationAPI } from '../../services/api';
import { Notification } from '../../types';

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.data.notifications);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async () => {
    if (!selectedNotification) return;
    try {
      await notificationAPI.markAsRead(selectedNotification);
      setNotifications(
        notifications.map((notification) =>
          notification._id === selectedNotification
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;
    try {
      await notificationAPI.deleteNotification(selectedNotification);
      setNotifications(
        notifications.filter((notification) => notification._id !== selectedNotification)
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    }
    handleMenuClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Event color="primary" />;
      case 'payment':
        return <Payment color="success" />;
      default:
        return <Info color="info" />;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return format(notificationDate, 'MMM d, yyyy');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge
            badgeContent={notifications.filter((n) => !n.read).length}
            color="error"
            sx={{ mr: 1 }}
          >
            <NotificationsIcon color="action" />
          </Badge>
          <Typography variant="h6">Notifications</Typography>
        </Box>

        {notifications.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No notifications
          </Typography>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read ? 'inherit' : 'action.hover',
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuOpen(e, notification._id)}
                    >
                      <MoreVert />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{getNotificationIcon(notification.type)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {getTimeAgo(notification.createdAt)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMarkAsRead}>
            <Check sx={{ mr: 1 }} /> Mark as read
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <Clear sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default NotificationList;
