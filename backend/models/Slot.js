import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate slots
slotSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;

