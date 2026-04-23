const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUserRole() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users and their roles
    const users = await User.find({});
    console.log('All users:');
    users.forEach(user => {
      console.log(`- ${user.email} | Role: ${user.role} | ID: ${user._id}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUserRole();
