import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.patch('/update-profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

export default router;
