import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Pool,
  FitnessCenter,
  DirectionsRun,
  LocalParking,
  Shower,
  Restaurant,
  Wifi,
  LocalCafe,
  ChildCare,
  AccessTime,
  AcUnit,
  SportsHandball,
} from '@mui/icons-material';

interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface GymFacilitiesProps {
  facilities: Facility[];
}

const GymFacilities: React.FC<GymFacilitiesProps> = ({ facilities }) => {
  const theme = useTheme();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'pool':
        return <Pool />;
      case 'gym':
        return <FitnessCenter />;
      case 'cardio':
        return <DirectionsRun />;
      case 'parking':
        return <LocalParking />;
      case 'shower':
        return <Shower />;
      case 'restaurant':
        return <Restaurant />;
      case 'wifi':
        return <Wifi />;
      case 'cafe':
        return <LocalCafe />;
      case 'childcare':
        return <ChildCare />;
      case '24hours':
        return <AccessTime />;
      case 'ac':
        return <AcUnit />;
      case 'sports':
        return <SportsHandball />;
      default:
        return <FitnessCenter />;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Facilities
      </Typography>
      <Grid container spacing={2}>
        {facilities.map((facility) => (
          <Grid item xs={6} sm={4} md={3} key={facility.id}>
            <Tooltip title={facility.description} arrow>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    mb: 1,
                    '& > svg': {
                      fontSize: 32,
                    },
                  }}
                >
                  {getIcon(facility.icon)}
                </Box>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  {facility.name}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default GymFacilities;
