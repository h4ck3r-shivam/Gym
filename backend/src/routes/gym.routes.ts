import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import {
  createGym,
  getAllGyms,
  getGym,
  updateGym,
  deleteGym,
  getMyGyms,
  searchGyms,
} from '../controllers/gym.controller';

const router = express.Router();

// Public routes
router.get('/search', searchGyms);
router.get('/', getAllGyms);
router.get('/:id', getGym);

// Protected routes
router.use(protect);

// Gym owner routes
router.get('/my/gyms', restrictTo('gym-owner'), getMyGyms);
router.post('/', restrictTo('gym-owner'), createGym);
router.patch('/:id', restrictTo('gym-owner'), updateGym);
router.delete('/:id', restrictTo('gym-owner'), deleteGym);

export default router;
