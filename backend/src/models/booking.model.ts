import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  gym: mongoose.Types.ObjectId;
  slot: mongoose.Types.ObjectId;
  startDate: Date;
  plan: 'perDay' | 'perWeek' | 'perMonth';
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentIntentId?: string;
}

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    gym: {
      type: Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'Booking must belong to a gym'],
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: [true, 'Booking must belong to a slot'],
    },
    startDate: {
      type: Date,
      required: [true, 'Booking must have a start date'],
    },
    plan: {
      type: String,
      enum: ['perDay', 'perWeek', 'perMonth'],
      required: [true, 'Booking must have a plan'],
    },
    amount: {
      type: Number,
      required: [true, 'Booking must have an amount'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bookingSchema.index({ user: 1, startDate: -1 });
bookingSchema.index({ gym: 1, startDate: -1 });
bookingSchema.index({ slot: 1, startDate: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
