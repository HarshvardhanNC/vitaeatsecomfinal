const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Update user health profile & generate targeted recommendations
// @route   POST /api/users/profile/health
// @access  Private
const updateHealthProfile = async (req, res) => {
  try {
    const { age, weight, height, activityLevel, goal } = req.body;
    
    if (!age || !weight || !height) return res.status(400).json({ message: 'Please precisely provide age, weight, and height metrics.' });

    // Calculate BMR (Mifflin-St Jeor simplified)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5; 
    
    let multiplier = 1.2;
    if (activityLevel === 'moderate') multiplier = 1.55;
    if (activityLevel === 'high') multiplier = 1.725;
    
    let target = bmr * multiplier;
    if (goal === 'weight-loss') target -= 500;
    if (goal === 'muscle-gain') target += 300;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not definitively found' });

    user.healthProfile = {
      age, 
      weight, 
      height, 
      activityLevel: activityLevel || 'low', 
      goal: goal || 'maintenance', 
      dailyCaloriesTarget: Math.round(target)
    };

    const updatedUser = await user.save();
    
    res.json({
      message: 'Health biometrics calculated and synchronized robustly.',
      healthProfile: updatedUser.healthProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Daily Temporal Nutrition Dashboard
// @route   GET /api/users/dashboard/nutrition
// @access  Private
const getNutritionDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      user: req.user._id,
      createdAt: { $gte: today }
    }).populate('orderItems.meal');

    let totalCalories = 0;
    let totalProtein = 0;

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.meal) {
          totalCalories += (item.meal.calories * item.quantity);
          totalProtein += (item.meal.protein * item.quantity);
        }
      });
    });

    const user = await User.findById(req.user._id);
    
    res.json({
      totalCalories,
      totalProtein,
      targetCalories: user?.healthProfile?.dailyCaloriesTarget || 2000,
      ordersSnapshot: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get User Health Profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -role');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Newsletter Subscription
// @route   POST /api/users/newsletter
// @access  Public
const toggleNewsletterSubscription = async (req, res) => {
  try {
    const { email, subscribe } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    let user = await User.findOne({ email });

    if (!user) {
      if (!subscribe) return res.status(400).json({ message: 'Not subscribed.' });
      
      // Guest creating newsletter sub
      user = await User.create({
        name: email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-8), // Dummy random password
        role: 'guest',
        isSubscribedToNewsletter: true
      });
      return res.json({ message: 'Subscribed successfully!' });
    }

    // Existing user
    user.isSubscribedToNewsletter = subscribe;
    await user.save();

    res.json({ message: subscribe ? 'Subscribed successfully!' : 'Unsubscribed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateHealthProfile, getNutritionDashboard, getUserProfile, toggleNewsletterSubscription };
