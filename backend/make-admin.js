const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Current role: ${user.role}`);
    
    user.role = 'admin';
    await user.save();
    
    console.log(`✅ User ${email} is now an admin!`);
    console.log(`New role: ${user.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.log('Usage: node make-admin.js <email>');
  console.log('Example: node make-admin.js your@email.com');
  process.exit(1);
}

makeAdmin(email);
