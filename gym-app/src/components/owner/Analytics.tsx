import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { analyticsAPI } from '../../services/api';

interface AnalyticsData {
  revenue: {
    daily: { date: string; amount: number }[];
    monthly: { month: string; amount: number }[];
  };
  bookings: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    byPlan: { plan: string; count: number }[];
  };
  members: {
    total: number;
    active: number;
    new: number;
    byAge: { range: string; count: number }[];
  };
}

const Analytics: React.FC<{ gymId: string }> = ({ gymId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [gymId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getGymAnalytics(gymId);
      setData(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
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

  if (!data) return null;

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ₹{data.revenue.monthly.reduce((acc, curr) => acc + curr.amount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Members
              </Typography>
              <Typography variant="h4">{data.members.active}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New Members
              </Typography>
              <Typography variant="h4">{data.members.new}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Bookings
              </Typography>
              <Typography variant="h4">{data.bookings.active}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Revenue Trend
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.revenue.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                formatter={(value: number) => [`₹${value}`, 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Bookings by Plan */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bookings by Plan
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.bookings.byPlan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="plan" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Members by Age */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Members by Age
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.members.byAge}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.members.byAge.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
