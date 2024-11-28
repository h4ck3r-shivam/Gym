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
  IconButton,
  Tooltip,
} from '@mui/material';
import { Event, AccessTime, Person } from '@mui/icons-material';
import { format, addDays, startOfWeek } from 'date-fns';

interface ClassSession {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: number;
  capacity: number;
  enrolled: number;
  type: string;
  level: string;
}

interface DaySchedule {
  date: Date;
  classes: ClassSession[];
}

interface ClassScheduleProps {
  schedule: DaySchedule[];
  onClassClick: (classId: string) => void;
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({
  schedule,
  onClassClick,
}) => {
  const timeSlots = Array.from(
    new Set(
      schedule
        .flatMap((day) => day.classes)
        .map((session) => session.time)
        .sort()
    )
  );

  const getClassForTimeSlot = (day: DaySchedule, time: string) => {
    return day.classes.find((session) => session.time === time);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Weekly Schedule
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              {schedule.map((day) => (
                <TableCell key={day.date.toString()} align="center">
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2">
                      {format(day.date, 'EEE')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(day.date, 'MMM d')}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((time) => (
              <TableRow key={time}>
                <TableCell>
                  <Typography variant="body2">{time}</Typography>
                </TableCell>
                {schedule.map((day) => {
                  const classSession = getClassForTimeSlot(day, time);
                  return (
                    <TableCell
                      key={`${day.date.toString()}-${time}`}
                      sx={{
                        minWidth: 200,
                        cursor: classSession ? 'pointer' : 'default',
                        '&:hover': classSession
                          ? {
                              backgroundColor: 'action.hover',
                            }
                          : {},
                      }}
                      onClick={() =>
                        classSession && onClassClick(classSession.id)
                      }
                    >
                      {classSession && (
                        <Box sx={{ p: 1 }}>
                          <Typography variant="subtitle2">
                            {classSession.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {classSession.instructor}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mt: 1,
                            }}
                          >
                            <Chip
                              size="small"
                              label={classSession.type}
                              color="primary"
                            />
                            <Chip
                              size="small"
                              label={classSession.level}
                              variant="outlined"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                              gap: 2,
                            }}
                          >
                            <Tooltip title="Duration">
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <AccessTime
                                  sx={{
                                    fontSize: 16,
                                    mr: 0.5,
                                    color: 'text.secondary',
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {classSession.duration} min
                                </Typography>
                              </Box>
                            </Tooltip>
                            <Tooltip title="Capacity">
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Person
                                  sx={{
                                    fontSize: 16,
                                    mr: 0.5,
                                    color: 'text.secondary',
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {classSession.enrolled}/
                                  {classSession.capacity}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClassSchedule;
