const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Meal'
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, {
  timestamps: true
});

// Ensure a user can only have one cart item per meal (we can just increase quantity instead)
cartItemSchema.index({ user: 1, meal: 1 }, { unique: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
