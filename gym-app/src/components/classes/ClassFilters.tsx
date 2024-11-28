import React from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ClassFiltersProps {
  filters: {
    type?: string;
    level?: string;
    instructor?: string;
    date?: Date | null;
    timeSlot?: string;
  };
  types: string[];
  levels: string[];
  instructors: Array<{ id: string; name: string }>;
  timeSlots: string[];
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const ClassFilters: React.FC<ClassFiltersProps> = ({
  filters,
  types,
  levels,
  instructors,
  timeSlots,
  onFilterChange,
  onReset,
}) => {
  const handleChange = (
    field: string,
    value: string | Date | null
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Filters</Typography>
        <Button variant="text" onClick={onReset}>
          Reset
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Class Type</InputLabel>
          <Select
            value={filters.type || ''}
            label="Class Type"
            onChange={(e: SelectChangeEvent) =>
              handleChange('type', e.target.value)
            }
          >
            <MenuItem value="">All Types</MenuItem>
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Level</InputLabel>
          <Select
            value={filters.level || ''}
            label="Level"
            onChange={(e: SelectChangeEvent) =>
              handleChange('level', e.target.value)
            }
          >
            <MenuItem value="">All Levels</MenuItem>
            {levels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Instructor</InputLabel>
          <Select
            value={filters.instructor || ''}
            label="Instructor"
            onChange={(e: SelectChangeEvent) =>
              handleChange('instructor', e.target.value)
            }
          >
            <MenuItem value="">All Instructors</MenuItem>
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.id}>
                {instructor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={filters.date}
            onChange={(newValue) => handleChange('date', newValue)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </LocalizationProvider>

        <FormControl fullWidth size="small">
          <InputLabel>Time Slot</InputLabel>
          <Select
            value={filters.timeSlot || ''}
            label="Time Slot"
            onChange={(e: SelectChangeEvent) =>
              handleChange('timeSlot', e.target.value)
            }
          >
            <MenuItem value="">Any Time</MenuItem>
            {timeSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {Object.entries(filters).map(
            ([key, value]) =>
              value && (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => handleChange(key, '')}
                  size="small"
                />
              )
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ClassFilters;
