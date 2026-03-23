const User = require('../models/User');
const Order = require('../models/Order');
const Meal = require('../models/Meal');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: 'user' });
    const ordersCount = await Order.countDocuments({});
    const mealsCount = await Meal.countDocuments({});

    // Calculate total revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
      usersCount,
      ordersCount,
      mealsCount,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
