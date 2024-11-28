import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

interface ScheduleItem {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface GymScheduleProps {
  schedule: ScheduleItem[];
}

const GymSchedule: React.FC<GymScheduleProps> = ({ schedule }) => {
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Opening Hours
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule.map((item) => (
              <TableRow
                key={item.day}
                sx={{
                  bgcolor: currentDay === item.day ? 'action.hover' : 'inherit',
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography
                    variant="body2"
                    fontWeight={currentDay === item.day ? 'bold' : 'normal'}
                  >
                    {item.day}
                  </Typography>
                </TableCell>
                <TableCell>
                  {item.isOpen ? (
                    <Typography variant="body2">
                      {item.openTime} - {item.closeTime}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Closed
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={item.isOpen ? 'Open' : 'Closed'}
                    color={item.isOpen ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GymSchedule;
