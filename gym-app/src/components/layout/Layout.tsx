import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: (theme) => darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
      }}
    >
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
