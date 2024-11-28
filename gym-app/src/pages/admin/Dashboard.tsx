import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const Dashboard = () => {
  // Mock data - will be replaced with real data from backend
  const stats = {
    totalBookings: 45,
    activeMembers: 120,
    revenue: 5000,
    availableSlots: 25,
  };

  const recentBookings = [
    { id: 1, user: 'John Doe', plan: 'Daily', date: '2024-01-20', status: 'Confirmed' },
    { id: 2, user: 'Jane Smith', plan: 'Weekly', date: '2024-01-19', status: 'Pending' },
    { id: 3, user: 'Mike Johnson', plan: 'Monthly', date: '2024-01-18', status: 'Confirmed' },
  ];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h5">{stats.totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Members
              </Typography>
              <Typography variant="h5">{stats.activeMembers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h5">${stats.revenue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Slots
              </Typography>
              <Typography variant="h5">{stats.availableSlots}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.user}</TableCell>
                      <TableCell>{booking.plan}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
