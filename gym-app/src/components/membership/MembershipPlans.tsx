import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
} from '@mui/material';
import { Check, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    duration: 'month',
    features: [
      'Access to gym equipment',
      'Basic fitness assessment',
      'Locker access',
      'Water dispenser',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    duration: 'month',
    features: [
      'All Basic features',
      'Personal trainer (2 sessions/week)',
      'Nutrition consultation',
      'Access to fitness classes',
      'Towel service',
      'Protein shake per session',
    ],
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 2999,
    duration: 'month',
    features: [
      'All Premium features',
      'Unlimited personal training',
      'Monthly body composition analysis',
      'Customized meal plans',
      'Spa access',
      'Guest passes (2/month)',
      'Priority booking',
    ],
  },
];

interface MembershipPlansProps {
  gymId?: string;
  standalone?: boolean;
}

const MembershipPlans: React.FC<MembershipPlansProps> = ({
  gymId,
  standalone = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    if (standalone) {
      navigate(`/booking?plan=${planId}`);
    } else if (gymId) {
      navigate(`/gym/${gymId}/booking?plan=${planId}`);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Membership Plans
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
                ...(plan.popular && {
                  border: `2px solid ${theme.palette.primary.main}`,
                }),
              }}
            >
              {plan.popular && (
                <Chip
                  icon={<Star />}
                  label="Most Popular"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: 20,
                    height: 24,
                  }}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  color="primary"
                >
                  {plan.name}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography
                    component="span"
                    variant="h4"
                    color="text.primary"
                  >
                    ₹{plan.price}
                  </Typography>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    /{plan.duration}
                  </Typography>
                </Box>

                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Check color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          variant: 'body2',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant={plan.popular ? 'contained' : 'outlined'}
                  fullWidth
                  size="large"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  Select Plan
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 4 }}
      >
        * All plans include access to basic gym facilities and equipment.
        Prices are inclusive of all taxes.
      </Typography>
    </Box>
  );
};

export default MembershipPlans;
