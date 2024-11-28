import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from '@mui/material';
import {
  Notifications,
  Security,
  Email,
  Language,
  DarkMode,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const passwordValidationSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

const Settings = () => {
  const { changePassword, error, clearError } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        clearError();
        setSuccessMessage(null);
        await changePassword(values.currentPassword, values.newPassword);
        setSuccessMessage('Password successfully updated');
        resetForm();
      } catch (err) {
        console.error('Password change failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsEnabled(event.target.checked);
  };

  const handleEmailNotificationsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailNotifications(event.target.checked);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {/* Account Security Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
              type="password"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.currentPassword &&
                Boolean(formik.errors.currentPassword)
              }
              helperText={
                formik.touched.currentPassword && formik.errors.currentPassword
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              margin="normal"
            />
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
              sx={{ mt: 2 }}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} />
              ) : (
                'Change Password'
              )}
            </Button>
          </form>
        </Paper>

        {/* Preferences Section */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive push notifications for bookings and updates"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notificationsEnabled}
                  onChange={handleNotificationsChange}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive email notifications for bookings and updates"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={emailNotifications}
                  onChange={handleEmailNotificationsChange}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText
                primary="Language"
                secondary="Choose your preferred language"
              />
              <ListItemSecondaryAction>
                <Button size="small">Change</Button>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <DarkMode />
              </ListItemIcon>
              <ListItemText
                primary="Dark Mode"
                secondary="Toggle dark mode theme"
              />
              <ListItemSecondaryAction>
                <Switch edge="end" checked={darkMode} onChange={toggleDarkMode} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Settings;
