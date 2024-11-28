import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Rating,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  IconButton,
  Divider,
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Instagram,
  LinkedIn,
  Email,
  AccessTime,
  LocationOn,
  Star,
  School,
  WorkHistory,
  EventNote,
  Reviews,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`instructor-tabpanel-${index}`}
      aria-labelledby={`instructor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data - replace with API call
const mockInstructor = {
  id: '1',
  name: 'Sarah Johnson',
  image: '/instructor1.jpg',
  rating: 4.8,
  reviewCount: 156,
  specialties: ['Yoga', 'Pilates', 'Meditation'],
  experience: '5+ years',
  bio: 'Certified yoga instructor specializing in Vinyasa and Hatha yoga. Passionate about helping others achieve their wellness goals through mindful movement and breath work.',
  availability: 'Mon-Fri',
  social: {
    instagram: 'sarah.yoga',
    linkedin: 'sarahjohnson',
    email: 'sarah@example.com',
  },
  certifications: [
    {
      name: 'RYT-200',
      organization: 'Yoga Alliance',
      year: 2018,
    },
    {
      name: 'Pilates Certification',
      organization: 'Pilates Method Alliance',
      year: 2019,
    },
  ],
  education: [
    {
      degree: 'BS in Exercise Science',
      school: 'State University',
      year: 2016,
    },
  ],
  gym: 'Fitness Plus',
  schedule: [
    {
      id: '1',
      className: 'Morning Yoga',
      time: '08:00 AM',
      date: '2024-01-22',
      duration: 60,
      location: 'Studio A',
      enrolled: 15,
      capacity: 20,
    },
    {
      id: '2',
      className: 'Pilates Basics',
      time: '10:00 AM',
      date: '2024-01-22',
      duration: 45,
      location: 'Studio B',
      enrolled: 12,
      capacity: 15,
    },
  ],
  reviews: [
    {
      id: '1',
      user: 'John D.',
      rating: 5,
      date: '2024-01-15',
      comment:
        'Sarah is an amazing instructor! Her classes are well-structured and she gives great individual attention.',
    },
    {
      id: '2',
      user: 'Emily R.',
      rating: 4,
      date: '2024-01-10',
      comment:
        'Very knowledgeable and patient instructor. Makes everyone feel comfortable regardless of their level.',
    },
  ],
};

const InstructorDetail: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              bgcolor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={mockInstructor.image}
                alt={mockInstructor.name}
                sx={{ width: 100, height: 100, mr: 3 }}
              />
              <Box>
                <Typography variant="h4" gutterBottom>
                  {mockInstructor.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating
                    value={mockInstructor.rating}
                    precision={0.1}
                    readOnly
                    sx={{ color: 'white' }}
                  />
                  <Typography sx={{ ml: 1 }}>
                    ({mockInstructor.reviewCount} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {mockInstructor.specialties.map((specialty, index) => (
                    <Chip
                      key={index}
                      label={specialty}
                      size="small"
                      sx={{ color: 'white', bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="instructor tabs"
            >
              <Tab label="About" />
              <Tab label="Schedule" />
              <Tab label="Reviews" />
            </Tabs>

            {/* About Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Biography
                  </Typography>
                  <Typography paragraph>{mockInstructor.bio}</Typography>

                  <Typography variant="h6" gutterBottom>
                    Certifications
                  </Typography>
                  <List>
                    {mockInstructor.certifications.map((cert, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <School />
                        </ListItemIcon>
                        <ListItemText
                          primary={cert.name}
                          secondary={`${cert.organization} • ${cert.year}`}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="h6" gutterBottom>
                    Education
                  </Typography>
                  <List>
                    {mockInstructor.education.map((edu, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <School />
                        </ListItemIcon>
                        <ListItemText
                          primary={edu.degree}
                          secondary={`${edu.school} • ${edu.year}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Contact Information
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <IconButton
                          component="a"
                          href={`https://instagram.com/${mockInstructor.social.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram />
                        </IconButton>
                        <IconButton
                          component="a"
                          href={`https://linkedin.com/in/${mockInstructor.social.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedIn />
                        </IconButton>
                        <IconButton
                          component="a"
                          href={`mailto:${mockInstructor.social.email}`}
                        >
                          <Email />
                        </IconButton>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        Available: {mockInstructor.availability}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        At: {mockInstructor.gym}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Schedule Tab */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {mockInstructor.schedule.map((session) => (
                  <Grid item xs={12} md={6} key={session.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {session.className}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTime
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(session.date), 'PPP')} at{' '}
                            {session.time} ({session.duration} min)
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn
                            fontSize="small"
                            sx={{ color: 'text.secondary', mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {session.location}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {session.enrolled}/{session.capacity} spots filled
                        </Typography>

                        <Button
                          variant="contained"
                          fullWidth
                          disabled={session.enrolled >= session.capacity}
                          sx={{ mt: 1 }}
                        >
                          {session.enrolled >= session.capacity
                            ? 'Class Full'
                            : 'Book Now'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Reviews Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                {mockInstructor.reviews.map((review) => (
                  <Grid item xs={12} key={review.id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1">
                            {review.user}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(review.date), 'PPP')}
                          </Typography>
                        </Box>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {review.comment}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InstructorDetail;
