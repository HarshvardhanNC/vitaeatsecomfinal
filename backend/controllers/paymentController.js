const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Meal = require('../models/Meal');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate('meal');
    const validCartItems = cartItems.filter(item => item.meal !== null);

    if (validCartItems.length === 0) {
      if (cartItems.length > 0) await CartItem.deleteMany({ user: req.user._id });
      return res.status(400).json({ message: 'No valid order items found.' });
    }

    // 1. Stock Validation Check
    for (const item of validCartItems) {
      if (item.meal.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.meal.name}. Only ${item.meal.stock} remaining.` });
      }
    }

    const orderItems = validCartItems.map(item => ({
      name: item.meal.name,
      quantity: item.quantity,
      image: item.meal.image,
      price: item.meal.price,
      meal: item.meal._id
    }));

    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 40; 

    // Create a Pending Order in DB first
    const dbOrder = new Order({
      orderItems,
      user: req.user._id,
      totalAmount,
      paymentStatus: 'Pending'
    });
    
    await dbOrder.save();

    // Create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${dbOrder._id}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    dbOrder.receiptId = razorpayOrder.id;
    await dbOrder.save();

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      dbOrderId: dbOrder._id
    });

  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong while creating razorpay order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const order = await Order.findById(dbOrderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.paymentStatus = 'Success';
      order.paymentId = razorpay_payment_id;
      order.status = 'Confirmed';
      await order.save();

      // Decrease stock mapping
      for (const item of order.orderItems) {
        const dbMeal = await Meal.findById(item.meal);
        if (dbMeal) {
          dbMeal.stock -= item.quantity;
          await dbMeal.save();
        }
      }

      // Clear cart
      await CartItem.deleteMany({ user: req.user._id });

      res.status(200).json({ message: "Payment verified successfully", orderId: order._id });
    } else {
      // Invalid signature
      const order = await Order.findById(dbOrderId);
      if (order) {
        order.paymentStatus = 'Failed';
        await order.save();
      }
      return res.status(400).json({ message: "Invalid payment signature!" });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// @desc    Get Invoice Details
// @route   GET /api/payment/invoice/:orderId
// @access  Private
const getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the user owns the order, or is an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this invoice' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment, getInvoice };
