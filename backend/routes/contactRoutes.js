const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create transporter based on environment variables
const createTransporter = () => {
  // Check if SMTP credentials are provided
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
  
  // Fallback to Gmail if credentials provided
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }
  
  // For development - use ethereal.email (test emails)
  return null;
};

// @desc    Submit contact form and send email
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message'
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const transporter = createTransporter();

    // If no transporter configured, still save/acknowledge but log
    if (!transporter) {
      console.log('Contact form submission (no SMTP configured):');
      console.log({ name, email, phone, subject, message });
      
      return res.status(200).json({
        success: true,
        message: 'Message received. We will get back to you soon!',
        note: 'Email sending is not configured. Please check server logs.'
      });
    }

    // Verify transporter connection
    await transporter.verify();

    // Company/Admin email (receives the contact form)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER;
    
    // Email to admin/company
    const adminMailOptions = {
      from: `"Mukhwas Contact Form" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <h2 style="color: #166534; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${subject}</td>
              </tr>
            </table>
            
            <h2 style="color: #166534; margin-top: 30px;">Message</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #166534;">
              <p style="margin: 0; line-height: 1.6; color: #374151;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
              <p>This email was sent from the Mukhwas eCommerce website contact form.</p>
              <p>Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Subject: ${subject}

Message:
${message}

Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: `"Mukhwas Team" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting Mukhwas!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Reaching Out!</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Dear ${name},</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Thank you for contacting Mukhwas! We have received your message regarding <strong>${subject}</strong> and will get back to you within 24-48 hours.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
              <h3 style="color: #166534; margin-top: 0; font-size: 18px;">Your Message</h3>
              <p style="color: #374151; margin: 0; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              If your inquiry is urgent, please feel free to call us at <strong>+91 98765 43210</strong> during our working hours (Mon-Sat, 9AM-8PM).
            </p>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" style="display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Browse Our Products</a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
              <p>Best regards,<br><strong>The Mukhwas Team</strong></p>
              <p style="margin-top: 10px;">© ${new Date().getFullYear()} Mukhwas. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
      text: `
Thank You for Reaching Out!

Dear ${name},

Thank you for contacting Mukhwas! We have received your message regarding "${subject}" and will get back to you within 24-48 hours.

Your Message:
"${message}"

If your inquiry is urgent, please feel free to call us at +91 98765 43210 during our working hours (Mon-Sat, 9AM-8PM).

Best regards,
The Mukhwas Team

© ${new Date().getFullYear()} Mukhwas. All rights reserved.
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or contact us directly at support@mukhwas.com'
    });
  }
});

// @desc    Get contact form status (for testing)
// @route   GET /api/contact/status
// @access  Public
router.get('/status', (req, res) => {
  const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_PASS);
  
  res.json({
    smtpConfigured: hasSmtp || hasGmail,
    smtpType: hasSmtp ? 'custom' : hasGmail ? 'gmail' : 'none',
    adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.GMAIL_USER || 'not configured'
  });
});

module.exports = router;
