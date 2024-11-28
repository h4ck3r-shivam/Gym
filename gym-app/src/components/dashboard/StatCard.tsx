import React from 'react';
import { Paper, Box, Typography, SvgIconProps } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<SvgIconProps>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary.main',
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: `${color}15`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography color="text.secondary" variant="body2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        {trend && (
          <Typography
            variant="caption"
            color={trend.isPositive ? 'success.main' : 'error.main'}
            sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
