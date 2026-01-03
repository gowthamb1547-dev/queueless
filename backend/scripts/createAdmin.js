import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/queueless');
    console.log('✅ Connected to MongoDB');

    const email = process.argv[2] || 'admin@queueless.com';
    const password = process.argv[3] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email, role: 'ADMIN' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email,
      password,
      role: 'ADMIN'
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log('   Role: ADMIN');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

