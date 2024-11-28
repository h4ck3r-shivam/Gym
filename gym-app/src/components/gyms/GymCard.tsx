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
import {
  LocationOn,
  AccessTime,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface GymCardProps {
  gym: {
    id: string;
    name: string;
    image: string;
    location: string;
    rating: number;
    reviewCount: number;
    facilities: string[];
    schedule: {
      openTime: string;
      closeTime: string;
    };
    isFavorite?: boolean;
  };
  onToggleFavorite?: (gymId: string) => void;
}

const GymCard: React.FC<GymCardProps> = ({ gym, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/gyms/${gym.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(gym.id);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          transition: 'all 0.3s ease',
        },
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={gym.image}
          alt={gym.name}
        />
        {onToggleFavorite && (
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
            onClick={handleFavoriteClick}
          >
            {gym.isFavorite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {gym.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {gym.location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTime sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {gym.schedule.openTime} - {gym.schedule.closeTime}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={gym.rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({gym.reviewCount})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {gym.facilities.slice(0, 3).map((facility) => (
            <Chip
              key={facility}
              label={facility}
              size="small"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
          {gym.facilities.length > 3 && (
            <Chip
              label={`+${gym.facilities.length - 3}`}
              size="small"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default GymCard;
