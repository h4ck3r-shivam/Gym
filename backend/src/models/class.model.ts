import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  name: string;
  instructor: {
    id: mongoose.Types.ObjectId;
    name: string;
    avatar: string;
    specialization: string;
  };
  gym: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number;
  capacity: number;
  enrolled: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    instructor: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      specialization: {
        type: String,
        required: true,
      },
    },
    gym: {
      type: Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    enrolled: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
ClassSchema.index({ gym: 1, startTime: 1 });
ClassSchema.index({ instructor: 1 });

// Middleware to ensure endTime is after startTime
ClassSchema.pre('save', function (next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Virtual for checking if class is full
ClassSchema.virtual('isFull').get(function (this: IClass) {
  return this.enrolled >= this.capacity;
});

// Virtual for available spots
ClassSchema.virtual('availableSpots').get(function (this: IClass) {
  return Math.max(0, this.capacity - this.enrolled);
});

export const Class = mongoose.model<IClass>('Class', ClassSchema);
