import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Check,
  Star,
  CreditCard,
  LocalActivity,
  FitnessCenter,
  Pool,
  SportsHandball,
  PersonalVideo,
} from '@mui/icons-material';
import MembershipCard from '../components/membership/MembershipCard';
import PaymentHistory from '../components/payment/PaymentHistory';

// Mock data - replace with API calls
const membershipPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49.99,
    period: 'month',
    features: [
      'Access to gym equipment',
      '2 group classes per week',
      'Locker room access',
      'Basic fitness assessment',
    ],
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79.99,
    period: 'month',
    features: [
      'Unlimited gym access',
      'Unlimited group classes',
      'Personal trainer (2 sessions/month)',
      'Nutrition consultation',
      'Access to pool and spa',
      'Advanced fitness tracking',
    ],
    recommended: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 129.99,
    period: 'month',
    features: [
      'All Premium features',
      'Personal trainer (4 sessions/month)',
      'Monthly massage session',
      'Priority class booking',
      'Guest passes (2/month)',
      'Exclusive events access',
      'Virtual training sessions',
    ],
    recommended: false,
  },
];

const Membership: React.FC = () => {
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setCheckoutDialogOpen(true);
  };

  const handleCloseCheckoutDialog = () => {
    setCheckoutDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleCheckout = () => {
    setLoading(true);
    // Implement payment processing logic
    setTimeout(() => {
      setLoading(false);
      handleCloseCheckoutDialog();
      // Show success message or redirect
    }, 2000);
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
              Membership Plans
            </Typography>
            <Typography variant="subtitle1">
              Choose the perfect plan for your fitness journey
            </Typography>
          </Paper>
        </Grid>

        {/* Current Membership */}
        <Grid item xs={12} md={6}>
          <MembershipCard />
        </Grid>

        {/* Payment History */}
        <Grid item xs={12} md={6}>
          <PaymentHistory />
        </Grid>

        {/* Membership Plans */}
        {membershipPlans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                ...(plan.recommended && {
                  border: `2px solid ${theme.palette.primary.main}`,
                }),
              }}
            >
              {plan.recommended && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: -30,
                    transform: 'rotate(45deg)',
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    px: 4,
                    py: 0.5,
                  }}
                >
                  Recommended
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ color: theme.palette.primary.main }}
                >
                  {plan.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h3" component="span">
                    ${plan.price}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="span"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    /{plan.period}
                  </Typography>
                </Box>

                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Check color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant={plan.recommended ? 'contained' : 'outlined'}
                  size="large"
                  onClick={() => handlePlanSelect(plan)}
                >
                  Choose {plan.name}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Checkout Dialog */}
      <Dialog
        open={checkoutDialogOpen}
        onClose={handleCloseCheckoutDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Complete Your Membership</DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedPlan.name} Plan
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                ${selectedPlan.price}/{selectedPlan.period}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Information
                </Typography>
                <TextField
                  fullWidth
                  label="Card Number"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVC"
                      type="password"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Summary
                </Typography>
                <Box
                  sx={{
                    bgcolor: theme.palette.grey[50],
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography>Plan Price</Typography>
                    <Typography>
                      ${selectedPlan.price}/{selectedPlan.period}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography>Tax</Typography>
                    <Typography>
                      ${(selectedPlan.price * 0.1).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: `1px solid ${theme.palette.divider}`,
                      pt: 1,
                      mt: 1,
                    }}
                  >
                    <Typography variant="subtitle1">Total</Typography>
                    <Typography variant="subtitle1">
                      ${(selectedPlan.price * 1.1).toFixed(2)}/
                      {selectedPlan.period}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckoutDialog}>Cancel</Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Complete Purchase'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Membership;
