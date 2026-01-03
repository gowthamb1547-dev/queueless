import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const fixAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Update admin password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await User.updateOne(
      { email: 'admin@example.com' },
      { password: hashedPassword }
    );
    console.log('✅ Fixed admin password');

    // Update test user password
    const userPassword = await bcrypt.hash('user123', 12);
    await User.updateOne(
      { email: 'user@example.com' },
      { password: userPassword }
    );
    console.log('✅ Fixed test user password');

    // Test the passwords
    const admin = await User.findOne({ email: 'admin@example.com' });
    const adminMatch = await admin.comparePassword('admin123');
    console.log(`Admin password test: ${adminMatch}`);

    const user = await User.findOne({ email: 'user@example.com' });
    const userMatch = await user.comparePassword('user123');
    console.log(`User password test: ${userMatch}`);

    await mongoose.disconnect();
    console.log('✅ Password fix completed!');
  } catch (error) {
    console.error('Error:', error);
  }
};

fixAdminPassword();
