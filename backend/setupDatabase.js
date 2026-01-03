import mongoose from 'mongoose';
import Slot from './models/Slot.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Slot.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    });
    console.log('✅ Created admin user: admin@example.com / admin123');

    // Create test user
    const userPassword = await bcrypt.hash('user123', 12);
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER'
    });
    console.log('✅ Created test user: user@example.com / user123');

    // Create slots for the next 14 days (excluding Sundays)
    const timeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const today = new Date();
    let slotCount = 0;

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);

      // Skip Sundays
      if (date.getDay() === 0) {
        console.log(`⏭️  Skipping Sunday: ${date.toDateString()}`);
        continue;
      }

      for (const timeSlot of timeSlots) {
        await Slot.create({
          date,
          timeSlot,
          isBooked: false
        });
        slotCount++;
      }
      
      console.log(`✅ Created slots for ${date.toDateString()}`);
    }

    console.log(`✅ Created ${slotCount} total slots`);

    // Show summary
    const totalSlots = await Slot.countDocuments();
    const totalUsers = await User.countDocuments();
    
    console.log('\n=== Database Setup Complete ===');
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Total Slots: ${totalSlots}`);
    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@example.com / admin123');
    console.log('User:  user@example.com / user123');

    await mongoose.disconnect();
    console.log('\n✅ Database setup completed!');

  } catch (error) {
    console.error('❌ Setup error:', error);
    process.exit(1);
  }
};

setupDatabase();
