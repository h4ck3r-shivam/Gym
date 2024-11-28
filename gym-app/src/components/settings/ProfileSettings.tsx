import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PhotoCamera, Save, Lock } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  currentPassword: Yup.string().min(8, 'Password must be at least 8 characters'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .when('currentPassword', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.required('New password is required'),
    }),
  confirmPassword: Yup.string().when('newPassword', {
    is: (val: string) => val && val.length > 0,
    then: (schema) =>
      schema
        .required('Confirm password is required')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  }),
});

const ProfileSettings: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    currentUser?.avatar || null
  );

  const formik = useFormik({
    initialValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Handle avatar upload if there's a new file
        let avatarUrl = currentUser?.avatar;
        if (avatarFile) {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          const uploadResponse = await userAPI.uploadAvatar(formData);
          avatarUrl = uploadResponse.data.data.avatarUrl;
        }

        // Update user profile
        const updateData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          avatar: avatarUrl,
        };

        const response = await userAPI.updateProfile(updateData);
        updateUser(response.data.data.user);

        // Handle password change if provided
        if (values.currentPassword && values.newPassword) {
          await userAPI.changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });
        }

        setSuccess('Profile updated successfully');
        handleClosePasswordDialog();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    formik.setFieldValue('currentPassword', '');
    formik.setFieldValue('newPassword', '');
    formik.setFieldValue('confirmPassword', '');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              src={avatarPreview || currentUser?.avatar}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              startIcon={<Lock />}
              onClick={handleOpenPasswordDialog}
              disabled={loading}
            >
              Change Password
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </form>

        <Dialog
          open={passwordDialogOpen}
          onClose={handleClosePasswordDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.currentPassword &&
                Boolean(formik.errors.currentPassword)
              }
              helperText={
                formik.touched.currentPassword && formik.errors.currentPassword
              }
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordDialog}>Cancel</Button>
            <Button onClick={() => formik.handleSubmit()} color="primary">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
