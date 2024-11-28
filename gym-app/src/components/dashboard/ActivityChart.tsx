import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ActivityData {
  date: string;
  bookings: number;
  attendance: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  title: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, title }) => {
  return (
    <Paper sx={{ p: 3, height: '400px' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="bookings"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ActivityChart;
