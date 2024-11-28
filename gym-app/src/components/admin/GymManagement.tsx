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
  Rating,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Edit,
  Delete,
  Block,
  CheckCircle,
  Search,
  LocationOn,
  AccessTime,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Gym, GymStatus } from '../../types/admin.types';

interface GymManagementProps {
  gyms: Gym[];
  onUpdateGym: (gymId: string, data: Partial<Gym>) => Promise<void>;
  onDeleteGym: (gymId: string) => Promise<void>;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Gym name is required'),
  location: Yup.string().required('Location is required'),
  status: Yup.string()
    .oneOf(['active', 'pending', 'suspended'] as GymStatus[])
    .required('Status is required'),
  openingHours: Yup.string().required('Opening hours are required'),
  closingHours: Yup.string().required('Closing hours are required'),
});

const GymManagement: React.FC<GymManagementProps> = ({
  gyms,
  onUpdateGym,
  onDeleteGym,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      status: 'active',
      openingHours: '',
      closingHours: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedGym) return;
      try {
        setLoading(true);
        setError(null);
        await onUpdateGym(selectedGym.id, {
          ...values,
          status: values.status as GymStatus,
        });
        handleCloseEditDialog();
      } catch (err: any) {
        setError(err.message || 'Failed to update gym');
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

  const handleOpenEditDialog = (gym: Gym) => {
    setSelectedGym(gym);
    formik.setValues({
      name: gym.name,
      location: gym.location,
      status: gym.status,
      openingHours: gym.openingHours,
      closingHours: gym.closingHours,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedGym(null);
    formik.resetForm();
    setError(null);
  };

  const handleOpenDeleteDialog = (gym: Gym) => {
    setSelectedGym(gym);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedGym(null);
    setError(null);
  };

  const handleDeleteGym = async () => {
    if (!selectedGym) return;
    try {
      setLoading(true);
      setError(null);
      await onDeleteGym(selectedGym.id);
      handleCloseDeleteDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to delete gym');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredGyms = gyms.filter(
    (gym) =>
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Gym Management
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search gyms..."
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
                <TableCell>Gym</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGyms
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((gym) => (
                  <TableRow key={gym.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Card sx={{ width: 60, height: 60, mr: 2 }}>
                          <CardMedia
                            component="img"
                            height="60"
                            image={gym.images[0] || '/default-gym.jpg'}
                            alt={gym.name}
                          />
                        </Card>
                        <Typography>{gym.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{gym.owner.name}</TableCell>
                    <TableCell>{gym.location}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Rating
                          value={gym.rating}
                          readOnly
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({gym.reviewCount})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={gym.status}
                        size="small"
                        color={getStatusColor(gym.status)}
                      />
                    </TableCell>
                    <TableCell>{gym.memberCount}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditDialog(gym)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(gym)}
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
          count={filteredGyms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Edit Gym Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Edit Gym</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Gym Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mt: 2, mb: 2 }}
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={
                formik.touched.location && Boolean(formik.errors.location)
              }
              helperText={
                formik.touched.location && formik.errors.location
              }
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Opening Hours"
                name="openingHours"
                value={formik.values.openingHours}
                onChange={formik.handleChange}
                error={
                  formik.touched.openingHours &&
                  Boolean(formik.errors.openingHours)
                }
                helperText={
                  formik.touched.openingHours &&
                  formik.errors.openingHours
                }
              />
              <TextField
                fullWidth
                label="Closing Hours"
                name="closingHours"
                value={formik.values.closingHours}
                onChange={formik.handleChange}
                error={
                  formik.touched.closingHours &&
                  Boolean(formik.errors.closingHours)
                }
                helperText={
                  formik.touched.closingHours &&
                  formik.errors.closingHours
                }
              />
            </Box>

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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
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

      {/* Delete Gym Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Gym</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete this gym? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteGym}
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

export default GymManagement;
