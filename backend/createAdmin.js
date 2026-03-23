const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

connectDB().then(async () => {
  try {
    const adminEmail = 'admin@vitaeats.com';
    const adminPassword = 'admin123';

    // Check if it already exists
    const userExists = await User.findOne({ email: adminEmail });
    if (userExists) {
      console.log(`\n✅ Admin already exists!`);
      console.log(`Email:    ${adminEmail}`);
      console.log(`Password: ${adminPassword}\n`);
      process.exit();
    }

    // Create the master admin using the Mongoose model
    const adminUser = new User({
      name: 'Master System Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin' // Force the admin role
    });

    await adminUser.save();

    console.log('\n🚀 Master Admin successfully created directly in MongoDB!');
    console.log('----------------------------------------------------');
    console.log('Email:    ', adminEmail);
    console.log('Password: ', adminPassword);
    console.log('----------------------------------------------------\n');

    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
});
