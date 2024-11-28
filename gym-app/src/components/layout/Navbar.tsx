import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme as useMuiTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  FitnessCenter,
  CalendarMonth,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { User } from '../../types';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode } = useCustomTheme();
  const navigate = useNavigate();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);

  const getUserInitials = (user: User) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { label: 'Find Gyms', path: '/gyms', icon: <FitnessCenter /> },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const userMenuItems = [
    { label: 'Profile', path: '/profile', icon: <AccountCircle /> },
    { label: 'My Bookings', path: '/bookings', icon: <CalendarMonth /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      open={Boolean(mobileAnchorEl)}
      onClose={handleClose}
      keepMounted
    >
      {navItems.map((item) => (
        <MenuItem
          key={item.path}
          onClick={handleClose}
          component={RouterLink}
          to={item.path}
        >
          {item.icon && <Box component="span" mr={1}>{item.icon}</Box>}
          {item.label}
        </MenuItem>
      ))}
      {!currentUser && (
        <>
          <Divider />
          <MenuItem component={RouterLink} to="/login" onClick={handleClose}>
            Login
          </MenuItem>
          <MenuItem component={RouterLink} to="/register" onClick={handleClose}>
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      keepMounted
    >
      {userMenuItems.map((item) => (
        <MenuItem
          key={item.path}
          onClick={handleClose}
          component={RouterLink}
          to={item.path}
        >
          {item.icon && <Box component="span" mr={1}>{item.icon}</Box>}
          {item.label}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem onClick={handleLogout}>
        <Box component="span" mr={1}><Logout /></Box>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleMobileMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          GymFlex
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              sx={{ mx: 1 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {currentUser ? (
          <Box sx={{ ml: 2 }}>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={currentUser.avatar}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
              >
                {getUserInitials(currentUser)}
              </Avatar>
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{ mx: 1 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/register"
              sx={{ mx: 1 }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
      {renderMobileMenu}
      {renderUserMenu}
    </AppBar>
  );
};

export default Navbar;
