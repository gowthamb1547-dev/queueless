import mongoose from 'mongoose';
import Slot from './models/Slot.js';
import Appointment from './models/Appointment.js';
import User from './models/User.js';

// Sample time slots
const timeSlots = [
  '09:00 AM',
  '10:00 AM', 
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM'
];

// Generate dates for next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    date.setHours(0, 0, 0, 0);
    dates.push(new Date(date));
  }
  
  return dates;
};

const seedSlots = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/queueless');
    console.log('Connected to MongoDB');

    // Clear existing slots
    await Slot.deleteMany({});
    console.log('Cleared existing slots');

    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log('Cleared existing appointments');

    const dates = generateDates();
    const createdSlots = [];

    // Create slots for each date
    for (const date of dates) {
      for (const timeSlot of timeSlots) {
        const slot = await Slot.create({
          date,
          timeSlot,
          isBooked: false
        });
        createdSlots.push(slot);
      }
    }

    console.log(`Created ${createdSlots.length} slots`);

    // Book some slots for testing
    const testUser = await User.findOne({ role: 'USER' });
    if (!testUser) {
      console.log('No test user found. Skipping appointment creation.');
    } else {
      // Book a few slots for testing
      const slotsToBook = createdSlots.slice(0, 3); // Book first 3 slots
      
      for (const slot of slotsToBook) {
        // Mark slot as booked
        slot.isBooked = true;
        await slot.save();

        // Create appointment
        await Appointment.create({
          userId: testUser._id,
          date: slot.date,
          timeSlot: slot.timeSlot,
          reason: 'Test appointment for slot filtering verification',
          status: 'Pending'
        });
      }

      console.log(`Booked ${slotsToBook.length} slots for testing`);
    }

    // Show summary
    const totalSlots = await Slot.countDocuments();
    const availableSlots = await Slot.countDocuments({ isBooked: false });
    const bookedSlots = await Slot.countDocuments({ isBooked: true });

    console.log('\n=== Slot Summary ===');
    console.log(`Total slots: ${totalSlots}`);
    console.log(`Available slots: ${availableSlots}`);
    console.log(`Booked slots: ${bookedSlots}`);

    // Show slots by date
    console.log('\n=== Slots by Date ===');
    for (const date of dates) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const daySlots = await Slot.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ timeSlot: 1 });

      const available = daySlots.filter(s => !s.isBooked);
      const booked = daySlots.filter(s => s.isBooked);

      console.log(`\n${date.toDateString()}:`);
      console.log(`  Available: ${available.length} slots`);
      console.log(`  Booked: ${booked.length} slots`);
      
      if (booked.length > 0) {
        console.log(`  Booked times: ${booked.map(s => s.timeSlot).join(', ')}`);
      }
    }

    await mongoose.disconnect();
    console.log('\nDatabase seeding completed!');

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedSlots();
