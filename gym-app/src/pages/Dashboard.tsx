import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import {
  FitnessCenter,
  Event,
  TrendingUp,
  Notifications,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - replace with actual API calls
const mockActivityData = [
  { date: '2024-01-01', visits: 4 },
  { date: '2024-01-02', visits: 3 },
  { date: '2024-01-03', visits: 5 },
  { date: '2024-01-04', visits: 2 },
  { date: '2024-01-05', visits: 4 },
  { date: '2024-01-06', visits: 6 },
  { date: '2024-01-07', visits: 4 },
];

const mockUpcomingClasses = [
  {
    id: 1,
    name: 'Yoga Flow',
    time: '10:00 AM',
    instructor: 'Sarah Johnson',
  },
  {
    id: 2,
    name: 'HIIT Training',
    time: '2:00 PM',
    instructor: 'Mike Peters',
  },
  {
    id: 3,
    name: 'Spin Class',
    time: '4:30 PM',
    instructor: 'Emma Davis',
  },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome back, John!
            </Typography>
            <Typography variant="subtitle1">
              Track your fitness journey and upcoming classes
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">This Month</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                12
              </Typography>
              <Typography color="text.secondary">Gym Sessions</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Upcoming</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                3
              </Typography>
              <Typography color="text.secondary">Booked Classes</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Progress</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                85%
              </Typography>
              <Typography color="text.secondary">Monthly Goal</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Activity Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockActivityData}
                  margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Classes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Upcoming Classes</Typography>
              <Button component={Link} to="/schedule" size="small">
                View All
              </Button>
            </Box>
            <List>
              {mockUpcomingClasses.map((class_, index) => (
                <React.Fragment key={class_.id}>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={class_.name}
                      secondary={
                        <>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" />
                            {class_.time} • {class_.instructor}
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < mockUpcomingClasses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Notifications sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6">Recent Notifications</Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="New HIIT class added"
                  secondary="A new high-intensity interval training class has been added to the schedule."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Achievement Unlocked"
                  secondary="Congratulations! You've completed 10 workouts this month."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Membership Renewal"
                  secondary="Your membership will be up for renewal in 7 days."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
