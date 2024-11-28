import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import { Instagram, LinkedIn, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface InstructorCardProps {
  instructor: {
    id: string;
    name: string;
    image: string;
    specialties: string[];
    rating: number;
    reviewCount: number;
    bio: string;
    social?: {
      instagram?: string;
      linkedin?: string;
      email?: string;
    };
  };
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/instructors/${instructor.id}`);
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
        height="240"
        image={instructor.image}
        alt={instructor.name}
        sx={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{ cursor: 'pointer' }}
          onClick={handleClick}
        >
          {instructor.name}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={instructor.rating} readOnly size="small" />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              ({instructor.reviewCount} reviews)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {instructor.bio}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {instructor.specialties.map((specialty) => (
            <Chip
              key={specialty}
              label={specialty}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>

        {instructor.social && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {instructor.social.instagram && (
              <IconButton
                size="small"
                href={instructor.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram fontSize="small" />
              </IconButton>
            )}
            {instructor.social.linkedin && (
              <IconButton
                size="small"
                href={instructor.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn fontSize="small" />
              </IconButton>
            )}
            {instructor.social.email && (
              <IconButton
                size="small"
                href={`mailto:${instructor.social.email}`}
              >
                <Email fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
