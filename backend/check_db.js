import mongoose from 'mongoose';
import Slot from './models/Slot.js';
import Appointment from './models/Appointment.js';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/queueless')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check slots
    const slots = await Slot.find({});
    console.log('Total slots:', slots.length);
    slots.forEach(slot => {
      console.log('Slot:', {
        id: slot._id,
        date: slot.date,
        timeSlot: slot.timeSlot,
        isBooked: slot.isBooked
      });
    });
    
    // Check appointments
    const appointments = await Appointment.find({});
    console.log('Total appointments:', appointments.length);
    
    await mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
