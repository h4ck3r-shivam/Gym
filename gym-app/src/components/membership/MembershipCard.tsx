import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  FitnessCenter,
  Payment,
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';

interface MembershipCardProps {
  membership: {
    plan: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'pending';
    totalSessions: number;
    remainingSessions: number;
    nextPaymentDate: string;
    amount: number;
  };
  onRenew?: () => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  onRenew,
}) => {
  const theme = useTheme();

  const daysRemaining = differenceInDays(
    new Date(membership.endDate),
    new Date()
  );

  const progressValue = Math.round(
    (membership.remainingSessions / membership.totalSessions) * 100
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'expired':
        return theme.palette.error.main;
      case 'pending':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        <Chip
          label={membership.status.toUpperCase()}
          sx={{
            backgroundColor: getStatusColor(membership.status),
            color: 'white',
          }}
          size="small"
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom color="primary">
          {membership.plan}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday
                fontSize="small"
                color="action"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Start Date:
              </Typography>
            </Box>
            <Typography variant="body1">
              {format(new Date(membership.startDate), 'PP')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime
                fontSize="small"
                color="action"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                End Date:
              </Typography>
            </Box>
            <Typography variant="body1">
              {format(new Date(membership.endDate), 'PP')}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FitnessCenter
                fontSize="small"
                color="action"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Sessions Remaining
              </Typography>
            </Box>
            <Typography variant="body2">
              {membership.remainingSessions}/{membership.totalSessions}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Payment fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Next Payment
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1">
              {format(new Date(membership.nextPaymentDate), 'PP')}
            </Typography>
            <Typography variant="h6" color="primary">
              ₹{membership.amount}
            </Typography>
          </Box>
        </Box>

        {daysRemaining <= 7 && membership.status === 'active' && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onRenew}
              color={daysRemaining <= 3 ? 'error' : 'warning'}
            >
              {daysRemaining <= 0
                ? 'Expired - Renew Now'
                : `Renew (${daysRemaining} days left)`}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
