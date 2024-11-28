import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Rating,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Instagram,
  LinkedIn,
  Email,
  LocationOn,
  AccessTime,
  EmojiEvents,
} from '@mui/icons-material';

interface InstructorProfileProps {
  instructor: {
    id: string;
    name: string;
    image: string;
    bio: string;
    specialties: string[];
    rating: number;
    reviewCount: number;
    experience: number;
    certifications: string[];
    schedule: {
      totalClasses: number;
      nextClass: string;
    };
    location: string;
    achievements: string[];
    social?: {
      instagram?: string;
      linkedin?: string;
      email?: string;
    };
  };
  onBookClass: () => void;
}

const InstructorProfile: React.FC<InstructorProfileProps> = ({
  instructor,
  onBookClass,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              src={instructor.image}
              alt={instructor.name}
              sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              {instructor.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Rating value={instructor.rating} readOnly />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                ({instructor.reviewCount} reviews)
              </Typography>
            </Box>
            {instructor.social && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {instructor.social.instagram && (
                  <IconButton
                    href={instructor.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </IconButton>
                )}
                {instructor.social.linkedin && (
                  <IconButton
                    href={instructor.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedIn />
                  </IconButton>
                )}
                {instructor.social.email && (
                  <IconButton href={`mailto:${instructor.social.email}`}>
                    <Email />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={onBookClass}
            sx={{ mb: 3 }}
          >
            Book a Class
          </Button>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {instructor.location}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Schedule
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {instructor.schedule.totalClasses} classes this week
              </Typography>
            </Box>
            <Typography variant="body2" color="primary">
              Next class: {instructor.schedule.nextClass}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography color="text.secondary">{instructor.bio}</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Specialties
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {instructor.specialties.map((specialty) => (
                <Chip
                  key={specialty}
                  label={specialty}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Certifications
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {instructor.certifications.map((cert) => (
                <Chip
                  key={cert}
                  label={cert}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Achievements
            </Typography>
            {instructor.achievements.map((achievement, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <EmojiEvents
                  sx={{ mr: 1, color: 'primary.main' }}
                  fontSize="small"
                />
                <Typography variant="body2">{achievement}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InstructorProfile;
