const express = require('express');
const nodemailer = require('nodemailer');
const WholesaleInquiry = require('../models/WholesaleInquiry');
const router = express.Router();

// Create transporter based on environment variables
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }
  
  return null;
};

// @desc    Submit wholesale inquiry
// @route   POST /api/wholesale
// @access  Public
router.post('/', async (req, res) => {
  try {
    const inquiryData = req.body;
    
    // Create inquiry in database
    const inquiry = await WholesaleInquiry.create(inquiryData);
    
    const transporter = createTransporter();
    
    // If no transporter configured, still save but log
    if (!transporter) {
      console.log('Wholesale inquiry received (no SMTP configured):');
      console.log(inquiryData);
      
      return res.status(200).json({
        success: true,
        message: 'Inquiry submitted successfully! We will contact you within 24 hours.',
        inquiryId: inquiry._id,
        note: 'Email sending is not configured. Please check server logs.'
      });
    }
    
    await transporter.verify();
    
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER;
    
    // Format products for email
    const productsList = inquiryData.products && inquiryData.products.length > 0
      ? inquiryData.products.map(p => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${p.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${p.quantity || 'Not specified'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${p.notes || '-'}</td>
        </tr>
      `).join('')
      : '<tr><td colspan="3" style="padding: 8px; text-align: center; color: #6b7280;">No specific products selected</td></tr>';
    
    // Admin notification email
    const adminMailOptions = {
      from: `"Mukhwas Wholesale" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `New Wholesale Inquiry: ${inquiryData.eventType} - ${inquiryData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Wholesale Inquiry</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <h2 style="color: #166534; margin-top: 0;">Contact Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Company:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.companyName || 'Not provided'}</td>
              </tr>
            </table>
            
            <h2 style="color: #166534; margin-top: 30px;">Event Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Event Type:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.eventType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Event Date:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.eventDate ? new Date(inquiryData.eventDate).toLocaleDateString('en-IN') : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Expected Guests:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.expectedGuests || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Budget:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.budget || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Packaging:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiryData.packaging || 'Not specified'}</td>
              </tr>
            </table>
            
            <h2 style="color: #166534; margin-top: 30px;">Products Interested</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #166534; color: white;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Quantity</th>
                  <th style="padding: 10px; text-align: left;">Notes</th>
                </tr>
              </thead>
              <tbody>
                ${productsList}
              </tbody>
            </table>
            
            ${inquiryData.message ? `
            <h2 style="color: #166534; margin-top: 30px;">Additional Message</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #166534;">
              <p style="margin: 0; line-height: 1.6; color: #374151;">${inquiryData.message.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p>Inquiry ID: ${inquiry._id}</p>
              <p>Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </div>
      `
    };
    
    // Customer confirmation email
    const customerMailOptions = {
      from: `"Mukhwas Wholesale Team" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: inquiryData.email,
      subject: 'Thank you for your wholesale inquiry!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Inquiry!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Dear ${inquiryData.name},</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Thank you for your interest in our wholesale Mukhwas products for your <strong>${inquiryData.eventType}</strong>!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
              <h3 style="color: #166534; margin-top: 0;">What happens next?</h3>
              <ul style="color: #374151; line-height: 1.8;">
                <li>Our wholesale team will review your inquiry within 24 hours</li>
                <li>We'll prepare a customized quote based on your requirements</li>
                <li>A dedicated account manager will contact you to discuss details</li>
                <li>We'll help you select the perfect Mukhwas varieties for your event</li>
              </ul>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Need urgent assistance?</strong> Call us at <strong>+91 98765 43210</strong> and mention your wholesale inquiry.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" style="display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Browse Our Products</a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
              <p>Best regards,<br><strong>The Mukhwas Wholesale Team</strong></p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} Mukhwas. All rights reserved.</p>
            </div>
          </div>
        </div>
      `
    };
    
    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Inquiry submitted successfully! We will contact you within 24 hours.',
      inquiryId: inquiry._id
    });
    
  } catch (error) {
    console.error('Wholesale inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again or contact us directly at +91 98765 43210'
    });
  }
});

// @desc    Get all wholesale inquiries (Admin only)
// @route   GET /api/wholesale
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const inquiries = await WholesaleInquiry.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Get wholesale inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries'
    });
  }
});

// @desc    Update inquiry status (Admin only)
// @route   PUT /api/wholesale/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const inquiry = await WholesaleInquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }
    
    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry'
    });
  }
});

module.exports = router;
