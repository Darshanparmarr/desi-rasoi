const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());

async function testDirectRegistration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test direct user creation
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    };

    console.log('Testing direct user creation...');
    
    // Test 1: Direct User.create
    try {
      const user1 = await User.create(testUser);
      console.log('✅ User.create() successful:', user1.email);
    } catch (error) {
      console.log('❌ User.create() failed:', error.message);
    }

    // Test 2: new User + save
    try {
      const user2 = new User(testUser);
      await user2.save();
      console.log('✅ new User() + save() successful:', user2.email);
    } catch (error) {
      console.log('❌ new User() + save() failed:', error.message);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Setup error:', error.message);
  }
}

testDirectRegistration();
