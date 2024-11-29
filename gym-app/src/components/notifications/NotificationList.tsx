import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { notificationAPI } from '../../services/api';
import { Notification } from '../../types';

interface NotificationListProps {
  limit?: number;
  showActions?: boolean;
  onNotificationUpdate?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  limit,
  showActions = true,
  onNotificationUpdate,
}) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      setNotifications(limit ? response.data.slice(0, limit) : response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser, limit]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      await fetchNotifications();
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      await fetchNotifications();
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  if (!currentUser) {
    return (
      <Alert severity="warning">
        Please log in to view notifications
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <NotificationIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
        <Typography color="text.secondary" mt={1}>
          No notifications
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {notifications.map((notification) => (
        <ListItem
          key={notification.id}
          sx={{
            bgcolor: notification.read ? 'transparent' : 'action.hover',
            '&:hover': { bgcolor: 'action.hover' },
          }}
          secondaryAction={
            showActions && (
              <Box>
                {!notification.read && (
                  <IconButton
                    edge="end"
                    aria-label="mark as read"
                    onClick={() => handleMarkAsRead(notification.id)}
                    sx={{ mr: 1 }}
                  >
                    <CheckIcon />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(notification.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )
          }
        >
          <ListItemAvatar>
            <Avatar>
              <NotificationIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">{notification.title}</Typography>
                {!notification.read && (
                  <Chip
                    label="New"
                    color="primary"
                    size="small"
                    sx={{ height: 20 }}
                  />
                )}
              </Box>
            }
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                  display="block"
                >
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(notification.createdAt), 'PPp')}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationList;
