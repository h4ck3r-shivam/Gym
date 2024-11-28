import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ClassCardProps {
  classData: {
    id: string;
    name: string;
    image: string;
    instructor: {
      id: string;
      name: string;
      image?: string;
    };
    date: string;
    time: string;
    duration: number;
    type: string;
    level: string;
    capacity: number;
    enrolled: number;
  };
  onBook?: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, onBook }) => {
  const navigate = useNavigate();
  const availableSpots = classData.capacity - classData.enrolled;

  const handleClick = () => {
    navigate(`/classes/${classData.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          transition: 'all 0.3s ease',
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={classData.image}
        alt={classData.name}
        sx={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: 'pointer' }}
              onClick={handleClick}
            >
              {classData.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Avatar
                src={classData.instructor.image}
                sx={{ width: 24, height: 24, mr: 1 }}
              >
                {classData.instructor.name[0]}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {classData.instructor.name}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip size="small" label={classData.type} />
            <Chip size="small" label={classData.level} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTime sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(classData.date), 'MMM dd')} at {classData.time} (
            {classData.duration} min)
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Person sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {availableSpots} spots available
          </Typography>
        </Box>

        {onBook && (
          <Button
            variant="contained"
            fullWidth
            onClick={onBook}
            disabled={availableSpots === 0}
          >
            {availableSpots > 0 ? 'Book Now' : 'Class Full'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassCard;
