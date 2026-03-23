const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Meal = require('../models/Meal');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate('meal');

    const validCartItems = cartItems.filter(item => item.meal !== null);

    if (validCartItems.length === 0) {
      if (cartItems.length > 0) await CartItem.deleteMany({ user: req.user._id }); // Clear ghost items
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

    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 40; // Add 40 for delivery

    const order = new Order({
      orderItems,
      user: req.user._id,
      totalAmount
    });

    const createdOrder = await order.save();

    // 2. Stock Synchronization (Decrease stock)
    for (const item of validCartItems) {
      const dbMeal = await Meal.findById(item.meal._id);
      dbMeal.stock -= item.quantity;
      await dbMeal.save();
    }

    // 3. Clear cart
    await CartItem.deleteMany({ user: req.user._id });

    res.status(201).json(createdOrder);
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

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
