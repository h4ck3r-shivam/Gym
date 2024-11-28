import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

const facilities = [
  'Cardio Equipment',
  'Weight Training',
  'Personal Training',
  'Yoga Classes',
  'Swimming Pool',
  'Sauna',
  'Locker Room',
  'Shower',
  'Parking',
  'Wifi',
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    facilities: true,
    location: true,
  });

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    applyFilters();
  };

  const handleFacilityChange = (facility: string) => {
    const updatedFacilities = selectedFacilities.includes(facility)
      ? selectedFacilities.filter((f) => f !== facility)
      : [...selectedFacilities, facility];
    setSelectedFacilities(updatedFacilities);
    applyFilters();
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
    applyFilters();
  };

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      facilities: selectedFacilities,
      location,
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedFacilities([]);
    setLocation('');
    onFilterChange({
      priceRange: [0, 5000],
      facilities: [],
      location: '',
    });
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Filters</Typography>
          <Button color="primary" onClick={resetFilters}>
            Reset All
          </Button>
        </Box>

        {/* Price Range Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 1,
            }}
            onClick={() => toggleSection('price')}
          >
            <Typography variant="subtitle1">Price Range</Typography>
            <IconButton size="small">
              {expandedSections.price ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.price}>
            <Box sx={{ px: 2 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
                step={100}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">₹{priceRange[0]}</Typography>
                <Typography variant="body2">₹{priceRange[1]}</Typography>
              </Box>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Facilities Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 1,
            }}
            onClick={() => toggleSection('facilities')}
          >
            <Typography variant="subtitle1">Facilities</Typography>
            <IconButton size="small">
              {expandedSections.facilities ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.facilities}>
            <FormGroup>
              {facilities.map((facility) => (
                <FormControlLabel
                  key={facility}
                  control={
                    <Checkbox
                      checked={selectedFacilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2">{facility}</Typography>
                  }
                />
              ))}
            </FormGroup>
          </Collapse>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Location Section */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              mb: 1,
            }}
            onClick={() => toggleSection('location')}
          >
            <Typography variant="subtitle1">Location</Typography>
            <IconButton size="small">
              {expandedSections.location ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={expandedSections.location}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter location"
              value={location}
              onChange={handleLocationChange}
            />
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
