import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ userId: 1, date: 1 });
appointmentSchema.index({ date: 1, timeSlot: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;

