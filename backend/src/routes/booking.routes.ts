import express from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  createPaymentIntent,
  confirmPayment,
} from '../controllers/booking.controller';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/:slotId', createBooking);
router.get('/my-bookings', getMyBookings);
router.patch('/cancel/:id', cancelBooking);

// Payment routes
router.post('/create-payment-intent/:slotId', createPaymentIntent);
router.post('/confirm-payment/:bookingId', confirmPayment);

export default router;
