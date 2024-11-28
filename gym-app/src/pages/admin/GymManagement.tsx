import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  Alert,
  Rating,
} from '@mui/material';
import { gymAPI } from '../../services/api';
import { Gym } from '../../types';

const GymManagement = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      setLoading(true);
      const response = await gymAPI.getAllGyms();
      setGyms(response.data.data.gyms);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch gyms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gym Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
          onClick={() => {/* TODO: Implement add gym */}}
        >
          Add New Gym
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Daily Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gyms.map((gym) => (
                <TableRow key={gym._id}>
                  <TableCell>{gym.name}</TableCell>
                  <TableCell>{gym.address}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={gym.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({gym.reviews.length})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>₹{gym.pricing.perDay}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default GymManagement;
