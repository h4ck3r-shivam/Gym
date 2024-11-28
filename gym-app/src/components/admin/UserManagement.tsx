import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  Block,
  CheckCircle,
  Search,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, UserRole, UserStatus } from '../../types/admin.types';

interface UserManagementProps {
  users: User[];
  onUpdateUser: (userId: string, data: Partial<User>) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(['user', 'owner', 'admin'])
    .required('Role is required'),
  status: Yup.string()
    .oneOf(['active', 'suspended', 'inactive'])
    .required('Status is required'),
});

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
      status: 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedUser) return;
      try {
        setLoading(true);
        setError(null);
        await onUpdateUser(selectedUser.id, {
          ...values,
          role: values.role as UserRole,
        });
        handleCloseEditDialog();
      } catch (err: any) {
        setError(err.message || 'Failed to update user');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    formik.setValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    formik.resetForm();
    setError(null);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    setError(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      setError(null);
      await onDeleteUser(selectedUser.id);
      handleCloseDeleteDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'owner':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          User Management
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={user.avatar}
                          sx={{ mr: 2, width: 32, height: 32 }}
                        >
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </Avatar>
                        <Typography>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={getRoleColor(user.role)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={getStatusColor(user.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.lastLogin), 'PP')}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(user)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName &&
                  Boolean(formik.errors.firstName)
                }
                helperText={
                  formik.touched.firstName && formik.errors.firstName
                }
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName &&
                  Boolean(formik.errors.lastName)
                }
                helperText={
                  formik.touched.lastName && formik.errors.lastName
                }
              />
            </Box>

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              sx={{ mb: 2 }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={
                formik.touched.status && Boolean(formik.errors.status)
              }
              helperText={formik.touched.status && formik.errors.status}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete this user? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserManagement;
