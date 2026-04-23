const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testRegistration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test user creation
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    };

    console.log('Creating test user...');
    const user = await User.create(testUser);
    console.log('User created successfully:', user);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
  }
}

testRegistration();
