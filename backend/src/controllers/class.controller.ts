import { Request, Response } from 'express';
import { Class, IClass } from '../models/class.model';
import { User } from '../models/user.model';
import { Gym } from '../models/gym.model';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';

export const createClass = async (req: Request, res: Response) => {
  try {
    const {
      name,
      instructorId,
      gymId,
      startTime,
      endTime,
      capacity,
      level,
      type,
      description,
    } = req.body;

    // Validate instructor exists and is an instructor
    const instructor = await User.findOne({
      _id: instructorId,
      role: 'instructor',
    });
    if (!instructor) {
      throw new ApiError(404, 'Instructor not found');
    }

    // Validate gym exists
    const gym = await Gym.findById(gymId);
    if (!gym) {
      throw new ApiError(404, 'Gym not found');
    }

    // Calculate duration in minutes
    const duration = Math.round(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) /
        (1000 * 60)
    );

    const newClass = await Class.create({
      name,
      instructor: {
        id: instructor._id,
        name: `${instructor.firstName} ${instructor.lastName}`,
        avatar: instructor.avatar,
        specialization: instructor.specialization,
      },
      gym: gymId,
      startTime,
      endTime,
      duration,
      capacity,
      level,
      type,
      description,
    });

    res.status(201).json({
      status: 'success',
      data: newClass,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Failed to create class');
  }
};

export const getClasses = async (req: Request, res: Response) => {
  try {
    const {
      gymId,
      startDate,
      endDate,
      instructorId,
      level,
      type,
    } = req.query;

    const query: any = {};

    if (gymId) {
      query.gym = gymId;
    }

    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    if (instructorId) {
      query['instructor.id'] = instructorId;
    }

    if (level) {
      query.level = level;
    }

    if (type) {
      query.type = type;
    }

    const classes = await Class.find(query)
      .sort({ startTime: 1 })
      .populate('gym', 'name location');

    res.status(200).json({
      status: 'success',
      results: classes.length,
      data: classes,
    });
  } catch (error) {
    throw new ApiError(400, 'Failed to fetch classes');
  }
};

export const getClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const classDetails = await Class.findById(classId).populate(
      'gym',
      'name location'
    );

    if (!classDetails) {
      throw new ApiError(404, 'Class not found');
    }

    res.status(200).json({
      status: 'success',
      data: classDetails,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Failed to fetch class details');
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const updates = req.body;

    // If updating instructor, validate new instructor
    if (updates.instructorId) {
      const instructor = await User.findOne({
        _id: updates.instructorId,
        role: 'instructor',
      });
      if (!instructor) {
        throw new ApiError(404, 'Instructor not found');
      }
      updates.instructor = {
        id: instructor._id,
        name: `${instructor.firstName} ${instructor.lastName}`,
        avatar: instructor.avatar,
        specialization: instructor.specialization,
      };
      delete updates.instructorId;
    }

    // If updating times, recalculate duration
    if (updates.startTime && updates.endTime) {
      updates.duration = Math.round(
        (new Date(updates.endTime).getTime() -
          new Date(updates.startTime).getTime()) /
          (1000 * 60)
      );
    }

    const updatedClass = await Class.findByIdAndUpdate(classId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedClass) {
      throw new ApiError(404, 'Class not found');
    }

    res.status(200).json({
      status: 'success',
      data: updatedClass,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Failed to update class');
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
      throw new ApiError(404, 'Class not found');
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Failed to delete class');
  }
};

export const enrollInClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const userId = req.user._id; // Assuming user is attached to req by auth middleware

    const classToEnroll = await Class.findById(classId);
    if (!classToEnroll) {
      throw new ApiError(404, 'Class not found');
    }

    if (classToEnroll.enrolled >= classToEnroll.capacity) {
      throw new ApiError(400, 'Class is full');
    }

    // Increment enrolled count
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $inc: { enrolled: 1 } },
      { new: true }
    );

    // Here you might want to create a booking record or add user to class attendees

    res.status(200).json({
      status: 'success',
      data: updatedClass,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Failed to enroll in class');
  }
};

export const unenrollFromClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const userId = req.user._id; // Assuming user is attached to req by auth middleware

    const classToUnenroll = await Class.findById(classId);
    if (!classToUnenroll) {
      throw new ApiError(404, 'Class not found');
    }

    // Decrement enrolled count
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $inc: { enrolled: -1 } },
      { new: true }
    );

    // Here you might want to update booking record or remove user from class attendees

    res.status(200).json({
      status: 'success',
      data: updatedClass,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, 'Failed to unenroll from class');
  }
};
