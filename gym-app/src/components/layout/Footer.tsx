import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'Blog', path: '/blog' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Find Gyms', path: '/gyms' },
        { label: 'Membership Plans', path: '/plans' },
        { label: 'Partner with Us', path: '/partner' },
        { label: 'Corporate Plans', path: '/corporate' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'FAQs', path: '/faqs' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com' },
    { icon: <Twitter />, url: 'https://twitter.com' },
    { icon: <Instagram />, url: 'https://instagram.com' },
    { icon: <LinkedIn />, url: 'https://linkedin.com' },
  ];

  const contactInfo = [
    { icon: <Email />, text: 'support@gymflex.com' },
    { icon: <Phone />, text: '+1 (555) 123-4567' },
    { icon: <LocationOn />, text: 'San Francisco, CA' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[900],
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography variant="h6" gutterBottom>
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link) => (
                  <Link
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              {contactInfo.map((info, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  {info.icon}
                  <Typography variant="body2">{info.text}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {currentYear} GymFlex. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={1}>
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
