import mongoose from 'mongoose';

export interface ISlot extends mongoose.Document {
  gym: mongoose.Types.ObjectId;
  time: string;
  capacity: number;
  available: number;
  status: 'available' | 'full' | 'closed';
  bookings: mongoose.Types.ObjectId[];
}

const slotSchema = new mongoose.Schema(
  {
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'Gym reference is required'],
    },
    time: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 1,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'full', 'closed'],
      default: 'available',
    },
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    }],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to update status based on availability
slotSchema.pre('save', function(next) {
  if (this.available === 0) {
    this.status = 'full';
  } else if (this.status !== 'closed' && this.available > 0) {
    this.status = 'available';
  }
  next();
});

export const Slot = mongoose.model<ISlot>('Slot', slotSchema);
