import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { settingsAPI } from '../../services/api';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const defaultSettings: NotificationSetting[] = [
  {
    id: 'booking_confirmation',
    name: 'Booking Confirmations',
    description: 'Receive notifications when your bookings are confirmed',
    enabled: true,
  },
  {
    id: 'booking_reminder',
    name: 'Booking Reminders',
    description: 'Get reminders before your scheduled gym sessions',
    enabled: true,
  },
  {
    id: 'payment_confirmation',
    name: 'Payment Confirmations',
    description: 'Receive notifications for successful payments',
    enabled: true,
  },
  {
    id: 'payment_reminder',
    name: 'Payment Reminders',
    description: 'Get reminders when payments are due',
    enabled: true,
  },
  {
    id: 'promotional',
    name: 'Promotional Updates',
    description: 'Receive updates about special offers and promotions',
    enabled: false,
  },
  {
    id: 'news_updates',
    name: 'News & Updates',
    description: 'Stay informed about gym news and updates',
    enabled: false,
  },
];

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getNotificationSettings();
      setSettings(response.data.data.settings);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (settingId: string) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await settingsAPI.updateNotificationSettings({
        settings: settings.map(({ id, enabled }) => ({ id, enabled })),
      });

      setSuccess('Notification settings updated successfully');
      setHasChanges(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Notification Settings</Typography>
          <Button
            variant="contained"
            startIcon={<Save />}
            disabled={saving || !hasChanges}
            onClick={handleSave}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <List>
          {settings.map((setting, index) => (
            <React.Fragment key={setting.id}>
              <ListItem>
                <ListItemText
                  primary={setting.name}
                  secondary={setting.description}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={setting.enabled}
                    onChange={() => handleToggle(setting.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {index < settings.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          You can customize your notification preferences here. These settings will
          apply to both email and in-app notifications.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
