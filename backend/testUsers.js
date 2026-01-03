import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Test password comparison for admin
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (admin) {
      const isMatch = await admin.comparePassword('admin123');
      console.log(`Admin password match: ${isMatch}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

testUsers();
