const mongoose = require('mongoose');

const wholesaleInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['Wedding', 'Corporate Event', 'Festival', 'Retail Store', 'Hotel/Restaurant', 'Other']
  },
  eventDate: {
    type: Date
  },
  expectedGuests: {
    type: String,
    enum: ['Less than 50', '50-100', '100-250', '250-500', '500-1000', '1000+']
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productName: String,
    quantity: Number,
    notes: String
  }],
  budget: {
    type: String,
    enum: ['Under ₹5,000', '₹5,000 - ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000+']
  },
  packaging: {
    type: String,
    enum: ['Standard', 'Gift Boxes', 'Custom Labels', 'Individual Packets', 'Not Sure']
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Quoted', 'Approved', 'Declined', 'Completed'],
    default: 'New'
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WholesaleInquiry', wholesaleInquirySchema);
