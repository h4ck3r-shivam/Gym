import axios from 'axios';
import { ApiResponse, Slot, SlotData } from '../../types';
import { API_URL } from './config';

const slotAPI = {
  getGymSlots: async (gymId: string): Promise<ApiResponse<Slot[]>> => {
    const response = await axios.get(`${API_URL}/gyms/${gymId}/slots`);
    return response.data;
  },

  getSlotById: async (gymId: string, slotId: string): Promise<ApiResponse<Slot>> => {
    const response = await axios.get(`${API_URL}/gyms/${gymId}/slots/${slotId}`);
    return response.data;
  },

  createSlot: async (gymId: string, data: SlotData): Promise<ApiResponse<Slot>> => {
    const response = await axios.post(`${API_URL}/gyms/${gymId}/slots`, data);
    return response.data;
  },

  updateSlot: async (gymId: string, slotId: string, data: Partial<SlotData>): Promise<ApiResponse<Slot>> => {
    const response = await axios.put(`${API_URL}/gyms/${gymId}/slots/${slotId}`, data);
    return response.data;
  },

  deleteSlot: async (gymId: string, slotId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axios.delete(`${API_URL}/gyms/${gymId}/slots/${slotId}`);
    return response.data;
  },

  getAvailableSlots: async (gymId: string, date: string): Promise<ApiResponse<Slot[]>> => {
    const response = await axios.get(`${API_URL}/gyms/${gymId}/slots/available`, {
      params: { date }
    });
    return response.data;
  }
};

export { slotAPI };
