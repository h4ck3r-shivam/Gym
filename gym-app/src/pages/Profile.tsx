import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  FitnessCenter,
  Event,
  Settings,
  Delete,
} from '@mui/icons-material';
import ProfileSettings from '../components/settings/ProfileSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import MembershipCard from '../components/membership/MembershipCard';
import PaymentHistory from '../components/payment/PaymentHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data - replace with API calls
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  avatar: '/avatars/john.jpg',
  membershipType: 'Premium',
  memberSince: '2023-01-01',
};

const mockActivityHistory = [
  {
    id: 1,
    type: 'Class',
    name: 'Morning Yoga',
    date: '2024-01-19',
    instructor: 'Sarah Johnson',
  },
  {
    id: 2,
    type: 'Gym Session',
    name: 'Weight Training',
    date: '2024-01-18',
    duration: '1.5 hours',
  },
  {
    id: 3,
    type: 'Class',
    name: 'HIIT Workout',
    date: '2024-01-17',
    instructor: 'Mike Peters',
  },
];

const Profile: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Implement profile photo change logic
    console.log('Changing profile photo:', event.target.files?.[0]);
  };

  const currentMembership = {
    // Replace with actual membership data
    membershipType: 'Premium',
    expirationDate: '2024-01-01',
  };

  const paymentHistory = [
    // Replace with actual payment history data
    {
      id: 1,
      date: '2024-01-01',
      amount: 99.99,
      paymentMethod: 'Credit Card',
    },
  ];

  const handleDownloadInvoice = (paymentId: number) => {
    // Implement download invoice logic
    console.log('Downloading invoice for payment:', paymentId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={mockUser.avatar}
                sx={{
                  width: 120,
                  height: 120,
                  border: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                {mockUser.firstName[0]}
                {mockUser.lastName[0]}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-photo-input"
                type="file"
                onChange={handleProfilePhotoChange}
              />
              <label htmlFor="profile-photo-input">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                {mockUser.firstName} {mockUser.lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {mockUser.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  icon={<FitnessCenter />}
                  label={mockUser.membershipType}
                  color="primary"
                />
                <Chip
                  label={`Member since ${new Date(
                    mockUser.memberSince
                  ).getFullYear()}`}
                />
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setIsEditingProfile(true)}
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Tabs Navigation */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Activity" icon={<FitnessCenter />} iconPosition="start" />
              <Tab label="Membership" icon={<Event />} iconPosition="start" />
              <Tab label="Settings" icon={<Settings />} iconPosition="start" />
            </Tabs>
          </Paper>
        </Grid>

        {/* Tab Content */}
        <Grid item xs={12}>
          <TabPanel value={tabValue} index={0}>
            <Paper>
              <List>
                {mockActivityHistory.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemText
                        primary={activity.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {activity.type}
                            </Typography>
                            {' • '}
                            {activity.date}
                            {activity.instructor && ` • ${activity.instructor}`}
                            {activity.duration && ` • ${activity.duration}`}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < mockActivityHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MembershipCard membership={currentMembership} />
              </Grid>
              <Grid item xs={12} md={6}>
                <PaymentHistory 
                  payments={paymentHistory} 
                  onDownloadInvoice={handleDownloadInvoice} 
                />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ProfileSettings
                  isOpen={isEditingProfile}
                  onClose={() => setIsEditingProfile(false)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <NotificationSettings />
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
