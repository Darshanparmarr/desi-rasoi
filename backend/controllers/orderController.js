const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const nodemailer = require('nodemailer');

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

const getOrderInvoiceBuffer = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const formatCurrency = (amount) => `INR ${Number(amount || 0).toFixed(2)}`;
    const invoiceNumber = order._id.toString().slice(-8).toUpperCase();
    const billingName = order.user?.name || order.shippingAddress?.name || 'Customer';
    const billingEmail = order.user?.email || order.guestInfo?.email || 'N/A';

    doc.fontSize(20).font('Helvetica-Bold').text('MUKHWAS', 50, 50);
    doc.fontSize(10).font('Helvetica').text('Premium Mouth Fresheners', 50, 75);
    doc.fontSize(10).text('support@mukhwas.com', 50, 90);

    doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', 400, 50, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(`Order #: ${invoiceNumber}`, 400, 75, { align: 'right' });
    doc.text(`Date: ${moment(order.createdAt).format('DD/MM/YYYY')}`, 400, 90, { align: 'right' });

    doc.moveTo(50, 120).lineTo(550, 120).stroke();

    doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 140);
    doc.fontSize(10).font('Helvetica').text(billingName, 50, 160);
    doc.text(billingEmail, 50, 175);
    doc.text(order.shippingAddress?.name || '', 50, 195);
    doc.text(order.shippingAddress?.address || '', 50, 210);
    doc.text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}`, 50, 225);
    doc.text(`PIN: ${order.shippingAddress?.pincode || ''}`, 50, 240);
    doc.text(`Phone: ${order.shippingAddress?.phone || ''}`, 50, 255);

    doc.fontSize(12).font('Helvetica-Bold').text('Order Status:', 400, 140, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(order.orderStatus, 400, 160, { align: 'right' });
    doc.fontSize(10).font('Helvetica-Bold').text('Payment Method:', 400, 180, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(order.paymentMethod, 400, 195, { align: 'right' });
    doc.fontSize(10).font('Helvetica-Bold').text('Payment Status:', 400, 215, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(order.isPaid ? 'Paid' : 'Pending', 400, 230, { align: 'right' });

    doc.moveTo(50, 290).lineTo(550, 290).stroke();
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Item', 50, 300);
    doc.text('Qty', 300, 300, { align: 'center', width: 50 });
    doc.text('Price', 370, 300, { align: 'right', width: 80 });
    doc.text('Total', 470, 300, { align: 'right', width: 80 });
    doc.moveTo(50, 320).lineTo(550, 320).stroke();

    let y = 335;
    doc.fontSize(10).font('Helvetica');
    order.orderItems.forEach((item) => {
      doc.text(item.name, 50, y, { width: 240 });
      doc.text(item.quantity.toString(), 300, y, { align: 'center', width: 50 });
      doc.text(formatCurrency(item.price), 370, y, { align: 'right', width: 80 });
      doc.text(formatCurrency(item.price * item.quantity), 470, y, { align: 'right', width: 80 });
      y += 20;
    });

    doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

    y += 25;
    doc.fontSize(10).font('Helvetica');
    doc.text('Subtotal:', 370, y, { align: 'right', width: 80 });
    doc.text(formatCurrency(order.itemsPrice), 470, y, { align: 'right', width: 80 });

    y += 20;
    doc.text('Shipping:', 370, y, { align: 'right', width: 80 });
    doc.text(formatCurrency(order.shippingPrice), 470, y, { align: 'right', width: 80 });

    y += 20;
    doc.font('Helvetica-Bold');
    doc.text('Total:', 370, y, { align: 'right', width: 80 });
    doc.text(formatCurrency(order.totalPrice), 470, y, { align: 'right', width: 80 });

    doc.fontSize(9).font('Helvetica');
    doc.text('Thank you for shopping with Mukhwas!', 50, 700, { align: 'center', width: 500 });
    doc.text('This is a computer-generated invoice and does not require a signature.', 50, 715, { align: 'center', width: 500 });

    doc.end();
  });
};

const sendOrderInvoiceEmail = async (order) => {
  const recipientEmail = order.user?.email || order.guestInfo?.email;
  if (!recipientEmail) {
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`Invoice email skipped for order ${order._id}: mailer not configured`);
    return;
  }

  const invoiceBuffer = await getOrderInvoiceBuffer(order);
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  const customerName = order.user?.name || order.shippingAddress?.name || 'Customer';
  const fromEmail = process.env.SMTP_USER || process.env.GMAIL_USER;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  await transporter.sendMail({
    from: `"Mukhwas Orders" <${fromEmail}>`,
    to: recipientEmail,
    subject: `Your Mukhwas Invoice - Order #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Order Confirmed</h2>
        <p>Hi ${customerName},</p>
        <p>Thanks for your order with Mukhwas. Your invoice is attached as a PDF.</p>
        <p><strong>Order ID:</strong> #${orderNumber}</p>
        <p><strong>Total:</strong> INR ${Number(order.totalPrice || 0).toFixed(2)}</p>
        <p>You can also track your order from your account/order page.</p>
        <p>
          <a href="${frontendUrl}/orders" style="display:inline-block;padding:10px 14px;background:#16a34a;color:#fff;text-decoration:none;border-radius:4px;">
            View Orders
          </a>
        </p>
        <p>Regards,<br/>Mukhwas Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `invoice-${orderNumber}.pdf`,
        content: invoiceBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
};

// @desc    Create new order (supports both logged-in users and guests)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      guestEmail,
      isGuest
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    };

    // Handle guest checkout
    if (isGuest || !req.user) {
      orderData.guestInfo = {
        email: guestEmail || shippingAddress.email,
        isGuest: true
      };
    } else {
      orderData.user = req.user._id;
      orderData.guestInfo = {
        isGuest: false
      };
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();
    await createdOrder.populate('user', 'name email');

    // Clear the cart after order is placed (only for logged-in users)
    if (req.user) {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [], totalAmount: 0 }
      );
    }

    // Send invoice email in background flow. Order creation should still succeed if email fails.
    try {
      await sendOrderInvoiceEmail(createdOrder);
    } catch (mailError) {
      console.error(`Failed to send invoice email for order ${createdOrder._id}:`, mailError.message);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (with validation)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // For guest orders, allow public access (they'll verify via email)
    if (order.guestInfo?.isGuest) {
      return res.json(order);
    }

    // For logged-in user orders, check authorization
    if (req.user) {
      if (order.user?._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        return res.json(order);
      }
    }

    res.status(401).json({ message: 'Not authorized' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark order as delivered with photo (Employee/Admin)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Employee or Admin
const markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is already delivered
    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ message: 'Order is already delivered' });
    }

    // Handle photo upload
    let deliveryPhoto = null;
    if (req.file) {
      deliveryPhoto = `/uploads/${req.file.filename}`;
    } else if (req.body.deliveryPhoto) {
      deliveryPhoto = req.body.deliveryPhoto;
    }

    // Update order
    order.orderStatus = 'Delivered';
    order.deliveredAt = Date.now();
    order.deliveredBy = req.user._id;
    order.deliveryPhoto = deliveryPhoto;

    const updatedOrder = await order.save();
    
    // Populate deliveredBy info before sending response
    await updatedOrder.populate('deliveredBy', 'name email');
    
    res.json({
      message: 'Order marked as delivered successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lookup guest order by ID and email
// @route   POST /api/orders/guest-lookup
// @access  Public
const lookupGuestOrder = async (req, res) => {
  try {
    const { orderId, email } = req.body;

    if (!orderId || !email) {
      return res.status(400).json({ message: 'Please provide order ID and email' });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify it's a guest order and email matches
    if (!order.guestInfo?.isGuest) {
      return res.status(400).json({ message: 'This is not a guest order. Please login to view.' });
    }

    const orderEmail = order.guestInfo?.email?.toLowerCase() || order.shippingAddress?.email?.toLowerCase();
    if (orderEmail !== email.toLowerCase()) {
      return res.status(401).json({ message: 'Email does not match order records' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate invoice PDF for order
// @route   GET /api/orders/:id/invoice
// @access  Private
const generateInvoicePDF = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order belongs to the current user or if user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id.toString().slice(-8).toUpperCase()}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Helper function to format currency
    const formatCurrency = (amount) => `INR ${Number(amount || 0).toFixed(2)}`;

    // Header - Company Info
    doc.fontSize(20).font('Helvetica-Bold').text('MUKHWAS', 50, 50);
    doc.fontSize(10).font('Helvetica').text('Premium Mouth Fresheners', 50, 75);
    doc.fontSize(10).text('support@mukhwas.com', 50, 90);

    // Invoice Title
    doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', 400, 50, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(`Order #: ${order._id.toString().slice(-8).toUpperCase()}`, 400, 75, { align: 'right' });
    doc.text(`Date: ${moment(order.createdAt).format('DD/MM/YYYY')}`, 400, 90, { align: 'right' });

    // Draw line
    doc.moveTo(50, 120).lineTo(550, 120).stroke();

    // Billing Info
    doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, 140);
    doc.fontSize(10).font('Helvetica').text(order.user?.name || order.shippingAddress?.name || 'Customer', 50, 160);
    doc.text(order.user?.email || order.guestInfo?.email || 'N/A', 50, 175);
    doc.text(order.shippingAddress.name, 50, 195);
    doc.text(order.shippingAddress.address, 50, 210);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, 50, 225);
    doc.text(`PIN: ${order.shippingAddress.pincode}`, 50, 240);
    doc.text(`Phone: ${order.shippingAddress.phone}`, 50, 255);

    // Order Status
    doc.fontSize(12).font('Helvetica-Bold').text('Order Status:', 400, 140, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(order.orderStatus, 400, 160, { align: 'right' });
    doc.fontSize(10).font('Helvetica-Bold').text('Payment Method:', 400, 180, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(order.paymentMethod, 400, 195, { align: 'right' });
    doc.fontSize(10).font('Helvetica-Bold').text('Payment Status:', 400, 215, { align: 'right' });
    doc.fontSize(10).font('Helvetica').text(order.isPaid ? 'Paid' : 'Pending', 400, 230, { align: 'right' });

    // Table Header
    doc.moveTo(50, 290).lineTo(550, 290).stroke();
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Item', 50, 300);
    doc.text('Qty', 300, 300, { align: 'center', width: 50 });
    doc.text('Price', 370, 300, { align: 'right', width: 80 });
    doc.text('Total', 470, 300, { align: 'right', width: 80 });
    doc.moveTo(50, 320).lineTo(550, 320).stroke();

    // Table Content
    let y = 335;
    doc.fontSize(10).font('Helvetica');
    order.orderItems.forEach((item) => {
      doc.text(item.name, 50, y, { width: 240 });
      doc.text(item.quantity.toString(), 300, y, { align: 'center', width: 50 });
      doc.text(formatCurrency(item.price), 370, y, { align: 'right', width: 80 });
      doc.text(formatCurrency(item.price * item.quantity), 470, y, { align: 'right', width: 80 });
      y += 20;
    });

    // Draw line after items
    doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

    // Totals
    y += 25;
    doc.fontSize(10).font('Helvetica');
    doc.text('Subtotal:', 370, y, { align: 'right', width: 80 });
    doc.text(formatCurrency(order.itemsPrice), 470, y, { align: 'right', width: 80 });

    y += 20;
    doc.text('Shipping:', 370, y, { align: 'right', width: 80 });
    doc.text(formatCurrency(order.shippingPrice), 470, y, { align: 'right', width: 80 });

    y += 20;
    doc.font('Helvetica-Bold');
    doc.text('Total:', 370, y, { align: 'right', width: 80 });
    doc.text(formatCurrency(order.totalPrice), 470, y, { align: 'right', width: 80 });

    // Footer
    doc.fontSize(9).font('Helvetica');
    doc.text('Thank you for shopping with Mukhwas!', 50, 700, { align: 'center', width: 500 });
    doc.text('This is a computer-generated invoice and does not require a signature.', 50, 715, { align: 'center', width: 500 });

    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  markOrderDelivered,
  getMyOrders,
  getOrders,
  generateInvoicePDF,
  lookupGuestOrder,
};
