import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Booking, IBooking } from '../models/booking.model';
import { Gym, IGym } from '../models/gym.model';
import { Slot } from '../models/slot.model';
import { AppError } from '../middleware/error.middleware';
import Stripe from 'stripe';

type PlanType = 'perDay' | 'perWeek' | 'perMonth';

interface CreateBookingBody {
  plan: PlanType;
  startDate: string;
  slotId: string;
  paymentMethodId: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createBooking = async (
  req: Request<{}, {}, CreateBookingBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { plan, startDate, slotId, paymentMethodId } = req.body;

    // Get gym and slot details
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return next(new AppError('Slot not found', 404));
    }

    const gym = await Gym.findById(slot.gym) as IGym;
    if (!gym) {
      return next(new AppError('Gym not found', 404));
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gym.pricing[plan],
      currency: 'inr',
      payment_method: paymentMethodId,
      confirm: true,
    });

    // Create booking
    const booking = await Booking.create({
      user: req.user!.id,
      gym: gym._id,
      slot: slot._id,
      startDate,
      plan,
      amount: gym.pricing[plan],
      paymentIntentId: paymentIntent.id,
      status: 'confirmed',
    }) as IBooking;

    res.status(201).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find({ user: req.user!.id })
      .populate({
        path: 'gym',
        select: 'name address city',
      })
      .populate({
        path: 'slot',
        select: 'time',
      });

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id) as IBooking;
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    if (booking.user.toString() !== req.user!.id) {
      return next(new AppError('You do not have permission to cancel this booking', 403));
    }

    if (booking.status === 'cancelled') {
      return next(new AppError('Booking is already cancelled', 400));
    }

    // Cancel payment intent
    if (booking.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Send webhook to gym owner about cancellation
    const webhookData = {
      type: 'booking.cancelled',
      data: {
        bookingId: booking._id,
        userId: booking.user,
        gymId: booking.gym,
        slotId: booking.slot,
        cancelledAt: new Date().toISOString(),
      },
    };

    // TODO: Implement webhook sending logic

    res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findOne({
      slot: req.params.slotId,
      user: req.user!.id,
      status: 'pending',
    });

    if (!booking) {
      return next(new AppError('No pending booking found', 404));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.amount * 100, // Convert to cents
      currency: 'inr',
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentIntentId } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return next(new AppError('No booking found with that ID', 404));
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return next(new AppError('Payment not successful', 400));
    }

    // Update booking status
    booking.status = 'confirmed';
    await booking.save();

    // Update slot availability
    const slot = await Slot.findById(booking.slot);
    if (slot) {
      slot.available -= 1;
      await slot.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } catch (error) {
    next(error);
  }
};
