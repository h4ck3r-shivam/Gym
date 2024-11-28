import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Button,
  Divider,
} from '@mui/material';

interface GymFiltersProps {
  filters: {
    location?: string;
    facilities: string[];
    priceRange: [number, number];
    rating?: number;
  };
  facilities: string[];
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const GymFilters: React.FC<GymFiltersProps> = ({
  filters,
  facilities,
  onFilterChange,
  onReset,
}) => {
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, location: event.target.value });
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    onFilterChange({ ...filters, priceRange: newValue as [number, number] });
  };

  const handleFacilityChange = (facility: string) => {
    const updatedFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter((f) => f !== facility)
      : [...filters.facilities, facility];
    onFilterChange({ ...filters, facilities: updatedFacilities });
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    onFilterChange({ ...filters, rating: newValue as number });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Filters</Typography>
        <Button variant="text" onClick={onReset}>
          Reset
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Location</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by location"
          value={filters.location || ''}
          onChange={handleLocationChange}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Price Range</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={50}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            ${filters.priceRange[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${filters.priceRange[1]}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Rating</Typography>
        <Slider
          value={filters.rating || 0}
          onChange={handleRatingChange}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.5}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography gutterBottom>Facilities</Typography>
        <FormGroup>
          {facilities.map((facility) => (
            <FormControlLabel
              key={facility}
              control={
                <Checkbox
                  checked={filters.facilities.includes(facility)}
                  onChange={() => handleFacilityChange(facility)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  {facility}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>
    </Paper>
  );
};

export default GymFilters;
