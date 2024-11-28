import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Slot } from '../models/slot.model';
import { Gym } from '../models/gym.model';
import { AppError } from '../middleware/error.middleware';

export const createSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gymId } = req.params;
    const { startTime, endTime, capacity, price } = req.body;

    // Check if gym exists
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return next(new AppError('Gym not found', 404));
    }

    // Create slot
    const slot = await Slot.create({
      gym: gymId,
      startTime,
      endTime,
      capacity,
      price,
    });

    // Add slot to gym's slots array
    gym.slots.push(slot._id as unknown as mongoose.Types.ObjectId);
    await gym.save();

    res.status(201).json({
      status: 'success',
      data: {
        slot,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getGymSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slots = await Slot.find({ gym: req.params.gymId })
      .populate({
        path: 'bookings',
        select: 'user date status',
      });

    res.status(200).json({
      status: 'success',
      results: slots.length,
      data: {
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return next(new AppError('No slot found with that ID', 404));
    }

    const gym = await Gym.findOne({
      _id: slot.gym,
      owner: req.user!.id,
    });

    if (!gym) {
      return next(new AppError('You are not authorized to update this slot', 403));
    }

    // Update capacity and available spots
    if (req.body.capacity) {
      const capacityDiff = req.body.capacity - slot.capacity;
      slot.capacity = req.body.capacity;
      slot.available += capacityDiff;
    }

    Object.assign(slot, req.body);
    await slot.save();

    res.status(200).json({
      status: 'success',
      data: {
        slot,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return next(new AppError('No slot found with that ID', 404));
    }

    const gym = await Gym.findOne({
      _id: slot.gym,
      owner: req.user!.id,
    });

    if (!gym) {
      return next(new AppError('You are not authorized to delete this slot', 403));
    }

    await slot.deleteOne();
    gym.slots = gym.slots.filter(
      (slotId) => slotId.toString() !== req.params.id
    );
    await gym.save();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.query;
    const slots = await Slot.find({
      gym: req.params.gymId,
      status: 'available',
      available: { $gt: 0 },
    }).select('time capacity available');

    res.status(200).json({
      status: 'success',
      results: slots.length,
      data: {
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};
