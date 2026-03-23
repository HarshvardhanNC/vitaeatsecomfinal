const CartItem = require('../models/CartItem');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate('meal');
    
    // Auto-clean ghost cart items (where meal was deleted by admin)
    const validItems = cartItems.filter(item => item.meal !== null);
    if (validItems.length !== cartItems.length) {
      const invalidIds = cartItems.filter(item => item.meal === null).map(item => item._id);
      await CartItem.deleteMany({ _id: { $in: invalidIds } });
    }

    res.json(validItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { mealId, quantity } = req.body;

    const existItem = await CartItem.findOne({ user: req.user._id, meal: mealId });

    if (existItem) {
      existItem.quantity += Number(quantity);
      const updatedItem = await existItem.save();
      res.json(updatedItem);
    } else {
      const cartItem = await CartItem.create({
        user: req.user._id,
        meal: mealId,
        quantity: Number(quantity)
      });
      res.status(201).json(cartItem);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);

    if (item && item.user.toString() === req.user._id.toString()) {
      await item.deleteOne();
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ message: 'Item not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
