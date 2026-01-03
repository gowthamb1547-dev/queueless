import mongoose from 'mongoose';
import Slot from './models/Slot.js';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const createTestData = async () => {
  try {
    // Connect to MongoDB using the same connection as server
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/queueless');
    console.log('Connected to MongoDB');

    // Create admin user if not exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      });
      console.log('✅ Created admin user: admin@example.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create regular user if not exists
    const existingUser = await User.findOne({ email: 'user@example.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('user123', 12);
      const user = await User.create({
        name: 'Test User',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'USER'
      });
      console.log('✅ Created test user: user@example.com / user123');
    } else {
      console.log('✅ Test user already exists');
    }

    // Clear existing slots
    await Slot.deleteMany({});
    console.log('✅ Cleared existing slots');

    // Create test slots for today and tomorrow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    
    const dates = [today, tomorrow];
    let createdCount = 0;

    for (const date of dates) {
      for (const timeSlot of timeSlots) {
        await Slot.create({
          date,
          timeSlot,
          isBooked: false
        });
        createdCount++;
      }
    }

    console.log(`✅ Created ${createdCount} slots for testing`);

    // Show summary
    const totalSlots = await Slot.countDocuments();
    console.log(`\nTotal slots in database: ${totalSlots}`);

    // Show slots by date
    for (const date of dates) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const daySlots = await Slot.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ timeSlot: 1 });

      console.log(`\n${date.toDateString()}:`);
      daySlots.forEach(slot => {
        console.log(`  ${slot.timeSlot} - ${slot.isBooked ? 'BOOKED' : 'AVAILABLE'}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Test data creation completed!');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();
