import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';

const signToken = (id: mongoose.Types.ObjectId, role: string): string => {
  return jwt.sign({ id: id.toString(), role }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password, role, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      address,
    });

    // Generate token
    const token = signToken(user._id, user.role);

    // Remove password from output
    user.password = undefined as any;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Generate token
    const token = signToken(user._id, user.role);

    // Remove password from output
    user.password = undefined as any;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { firstName, lastName, phone, address },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user from collection
    const user = await User.findById(req.user!.id).select('+password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Your current password is wrong', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = signToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error);
  }
};
