import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { slotAPI } from '../../services/api';
import { Slot, CreateSlotDTO, UpdateSlotDTO } from '../../types';

interface SlotManagementProps {
  gymId: string;
}

const SlotManagement: React.FC<SlotManagementProps> = ({ gymId }) => {
  const { token } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

  const fetchSlots = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await slotAPI.getGymSlots(gymId, token);
      if (response.data?.slots) {
        setSlots(response.data.slots);
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [gymId, token]);

  const handleAddSlot = () => {
    setIsAddingSlot(true);
    setEditingSlot(null);
  };

  const handleEditSlot = (slot: Slot) => {
    setEditingSlot(slot);
    setIsAddingSlot(false);
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!token) return;
    try {
      await slotAPI.deleteSlot(gymId, slotId, token);
      setSlots(slots.filter(slot => slot.id !== slotId));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete slot');
    }
  };

  const handleSlotSubmit = async (slotData: CreateSlotDTO | UpdateSlotDTO) => {
    if (!token) return;
    try {
      if (editingSlot) {
        const response = await slotAPI.updateSlot(
          gymId, 
          editingSlot.id, 
          slotData as UpdateSlotDTO, 
          token
        );
        if (response.data?.slot) {
          setSlots(slots.map(slot => 
            slot.id === editingSlot.id ? response.data.slot : slot
          ));
        }
      } else {
        const response = await slotAPI.createSlot(gymId, slotData as CreateSlotDTO, token);
        if (response.data?.slot) {
          setSlots([...slots, response.data.slot]);
        }
      }
      setIsAddingSlot(false);
      setEditingSlot(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save slot');
    }
  };

  const handleCancel = () => {
    setIsAddingSlot(false);
    setEditingSlot(null);
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to manage slots
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Manage Slots
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddSlot}
          disabled={isAddingSlot || !!editingSlot}
        >
          Add New Slot
        </Button>
      </Box>

      {(isAddingSlot || editingSlot) && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingSlot ? 'Edit Slot' : 'Add New Slot'}
          </Typography>
          <SlotForm
            initialData={editingSlot || undefined}
            onSubmit={handleSlotSubmit}
            onCancel={handleCancel}
          />
        </Paper>
      )}

      <Grid container spacing={2}>
        {slots.map((slot) => (
          <Grid item xs={12} sm={6} md={4} key={slot.id}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6">
                    {slot.startTime} - {slot.endTime}
                  </Typography>
                  <Typography color="textSecondary">
                    Capacity: {slot.capacity}
                  </Typography>
                  <Typography color="textSecondary">
                    Daily Price: ₹{slot.price.day}
                  </Typography>
                  <Typography color="textSecondary">
                    Weekly Price: ₹{slot.price.week}
                  </Typography>
                  <Typography color="textSecondary">
                    Monthly Price: ₹{slot.price.month}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEditSlot(slot)}
                    disabled={isAddingSlot || !!editingSlot}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSlot(slot.id)}
                    disabled={isAddingSlot || !!editingSlot}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SlotManagement;
