import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import {
  createSlot,
  getGymSlots,
  updateSlot,
  deleteSlot,
  getAvailableSlots,
} from '../controllers/slot.controller';

const router = express.Router();

// Public routes
router.get('/gym/:gymId', getGymSlots);
router.get('/available/:gymId', getAvailableSlots);

// Protected routes
router.use(protect);

// Gym owner routes
router.post('/:gymId', restrictTo('gym-owner'), createSlot);
router.patch('/:id', restrictTo('gym-owner'), updateSlot);
router.delete('/:id', restrictTo('gym-owner'), deleteSlot);

export default router;
