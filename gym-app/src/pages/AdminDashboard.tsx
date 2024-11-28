import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  People,
  FitnessCenter,
  TrendingUp,
  Event,
  AttachMoney,
  SupervisorAccount,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UserManagement from '../components/admin/UserManagement';
import GymManagement from '../components/admin/GymManagement';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data - replace with API calls
const mockRevenueData = [
  { month: 'Jan', revenue: 15000 },
  { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 16000 },
  { month: 'Apr', revenue: 19000 },
  { month: 'May', revenue: 22000 },
  { month: 'Jun', revenue: 25000 },
];

const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'user' as const,
    status: 'active' as const,
    createdAt: '2024-01-01',
    lastLogin: '2024-01-19',
  },
  // Add more mock users
];

const mockGyms = [
  {
    id: '1',
    name: 'Fitness Plus',
    owner: {
      id: 'o1',
      name: 'Mike Johnson',
      email: 'mike@example.com',
    },
    location: '123 Main St, City',
    status: 'active' as const,
    rating: 4.5,
    reviewCount: 128,
    memberCount: 450,
    images: ['/gym1.jpg'],
    openingHours: '06:00',
    closingHours: '22:00',
    facilities: ['Weights', 'Cardio', 'Pool'],
  },
  // Add more mock gyms
];

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUpdateUser = async (userId: string, data: any) => {
    // Implement user update logic
    console.log('Updating user:', userId, data);
  };

  const handleDeleteUser = async (userId: string) => {
    // Implement user delete logic
    console.log('Deleting user:', userId);
  };

  const handleUpdateGym = async (gymId: string, data: any) => {
    // Implement gym update logic
    console.log('Updating gym:', gymId, data);
  };

  const handleDeleteGym = async (gymId: string) => {
    // Implement gym delete logic
    console.log('Deleting gym:', gymId);
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
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1">
              Manage users, gyms, and monitor system performance
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                1,234
              </Typography>
              <Typography color="text.secondary">
                +12% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Gyms</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                48
              </Typography>
              <Typography color="text.secondary">
                +3 new this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Revenue</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                $25K
              </Typography>
              <Typography color="text.secondary">
                +18% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockRevenueData}
                  margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Management Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="admin tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label="User Management"
                icon={<People />}
                iconPosition="start"
              />
              <Tab
                label="Gym Management"
                icon={<FitnessCenter />}
                iconPosition="start"
              />
              <Tab
                label="Class Management"
                icon={<Event />}
                iconPosition="start"
              />
              <Tab
                label="Reports"
                icon={<TrendingUp />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </Grid>

        {/* Tab Content */}
        <Grid item xs={12}>
          <TabPanel value={tabValue} index={0}>
            <UserManagement
              users={mockUsers}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <GymManagement
              gyms={mockGyms}
              onUpdateGym={handleUpdateGym}
              onDeleteGym={handleDeleteGym}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Implement Class Management */}
            <Typography variant="h6">Class Management Coming Soon</Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {/* Implement Reports */}
            <Typography variant="h6">Reports Coming Soon</Typography>
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
