import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { format } from 'date-fns';

interface ClassSession {
  id: string;
  name: string;
  type: string;
  level: string;
  time: string;
  duration: number;
  date: string;
  location: string;
  enrolled: number;
  capacity: number;
}

interface InstructorScheduleProps {
  schedule: ClassSession[];
  onBookClass: (classId: string) => void;
}

const InstructorSchedule: React.FC<InstructorScheduleProps> = ({
  schedule,
  onBookClass,
}) => {
  const groupedSchedule = schedule.reduce((acc, session) => {
    const date = format(new Date(session.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, ClassSession[]>);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Class Schedule
      </Typography>

      {Object.entries(groupedSchedule).map(([date, sessions]) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{
              bgcolor: 'background.default',
              p: 1,
              borderRadius: 1,
              mb: 2,
            }}
          >
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Availability</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {session.time}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {session.duration} min
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {session.name}
                      </Typography>
                      <Chip
                        label={session.level}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={session.type}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {session.location}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {session.enrolled}/{session.capacity} spots
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onBookClass(session.id)}
                        disabled={session.enrolled >= session.capacity}
                      >
                        {session.enrolled >= session.capacity
                          ? 'Full'
                          : 'Book'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Paper>
  );
};

export default InstructorSchedule;
