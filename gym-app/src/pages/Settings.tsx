import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  Security,
  Payment,
  Person,
  Email,
} from '@mui/icons-material';

// Mock user data - replace with API call
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  preferences: {
    darkMode: false,
    language: 'English',
    timezone: 'America/New_York',
  },
};

const Settings: React.FC = () => {
  const theme = useTheme();
  const [user, setUser] = useState(mockUser);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNotificationChange = (type: keyof typeof user.notifications) => {
    setUser((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleSaveProfile = () => {
    setLoading(true);
    // Implement profile update logic
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handlePasswordChange = () => {
    setLoading(true);
    // Implement password change logic
    setTimeout(() => {
      setLoading(false);
      setPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password changed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

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
            <Typography variant="h4" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="subtitle1">
              Manage your account preferences and security
            </Typography>
          </Paper>
        </Grid>

        {/* Success Message */}
        {successMessage && (
          <Grid item xs={12}>
            <Alert severity="success">{successMessage}</Alert>
          </Grid>
        )}

        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="h6">Profile Information</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Security sx={{ mr: 1 }} />
              <Typography variant="h6">Security</Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemText
                  primary="Password"
                  secondary="Last changed 3 months ago"
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="outlined"
                    onClick={() => setPasswordDialog(true)}
                  >
                    Change
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Enable additional security"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" color="primary">
                    Setup
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Notifications sx={{ mr: 1 }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive updates about your bookings and classes"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={user.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive real-time updates on your device"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={user.notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="SMS Notifications"
                  secondary="Receive text messages for important updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={user.notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Payment Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Payment sx={{ mr: 1 }} />
              <Typography variant="h6">Payment Methods</Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemText
                  primary="Credit Card ending in 4242"
                  secondary="Expires 12/24"
                />
                <ListItemSecondaryAction>
                  <Button variant="outlined" color="error" sx={{ mr: 1 }}>
                    Remove
                  </Button>
                  <Button variant="outlined">Edit</Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<Payment />}
            >
              Add Payment Method
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={
              loading ||
              !currentPassword ||
              !newPassword ||
              newPassword !== confirmPassword
            }
          >
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
