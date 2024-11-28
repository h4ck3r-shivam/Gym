import { Request, Response, NextFunction } from 'express';
import { Gym } from '../models/gym.model';
import { AppError } from '../middleware/error.middleware';

export const createGym = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gymData = {
      ...req.body,
      owner: req.user!.id,
    };

    const gym = await Gym.create(gymData);

    res.status(201).json({
      status: 'success',
      data: {
        gym,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGyms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gyms = await Gym.find().populate('owner', 'name email');

    res.status(200).json({
      status: 'success',
      results: gyms.length,
      data: {
        gyms,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getGym = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gym = await Gym.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('slots')
      .populate('reviews');

    if (!gym) {
      return next(new AppError('No gym found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        gym,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateGym = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gym = await Gym.findOne({
      _id: req.params.id,
      owner: req.user!.id,
    });

    if (!gym) {
      return next(new AppError('No gym found with that ID', 404));
    }

    Object.assign(gym, req.body);
    await gym.save();

    res.status(200).json({
      status: 'success',
      data: {
        gym,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGym = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gym = await Gym.findOneAndDelete({
      _id: req.params.id,
      owner: req.user!.id,
    });

    if (!gym) {
      return next(new AppError('No gym found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyGyms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gyms = await Gym.find({ owner: req.user!.id });

    res.status(200).json({
      status: 'success',
      results: gyms.length,
      data: {
        gyms,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const searchGyms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query, city, state } = req.query;
    const searchQuery: any = {};

    if (query) {
      searchQuery.$text = { $search: query as string };
    }

    if (city) {
      searchQuery.city = new RegExp(city as string, 'i');
    }

    if (state) {
      searchQuery.state = new RegExp(state as string, 'i');
    }

    const gyms = await Gym.find(searchQuery)
      .populate('owner', 'name email')
      .select('-reviews -slots');

    res.status(200).json({
      status: 'success',
      results: gyms.length,
      data: {
        gyms,
      },
    });
  } catch (error) {
    next(error);
  }
};
