import mongoose from 'mongoose';

export interface IGym extends mongoose.Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  description: string;
  facilities: string[];
  openingTime: string;
  closingTime: string;
  pricing: {
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  slots: mongoose.Types.ObjectId[];
}

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Gym name is required'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Gym owner is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'PIN code is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    facilities: [{
      type: String,
      required: [true, 'At least one facility is required'],
    }],
    openingTime: {
      type: String,
      required: [true, 'Opening time is required'],
    },
    closingTime: {
      type: String,
      required: [true, 'Closing time is required'],
    },
    pricing: {
      perDay: {
        type: Number,
        required: [true, 'Daily price is required'],
        min: 0,
      },
      perWeek: {
        type: Number,
        required: [true, 'Weekly price is required'],
        min: 0,
      },
      perMonth: {
        type: Number,
        required: [true, 'Monthly price is required'],
        min: 0,
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }],
    slots: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search functionality
gymSchema.index({ name: 'text', city: 'text', state: 'text' });

export const Gym = mongoose.model<IGym>('Gym', gymSchema);
