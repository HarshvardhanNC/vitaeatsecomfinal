const express = require('express');
const router = express.Router();
const { getMeals, createMeal, updateMeal, deleteMeal } = require('../controllers/mealController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getMeals)
  .post(protect, isAdmin, createMeal);

router.route('/:id')
  .put(protect, isAdmin, updateMeal)
  .delete(protect, isAdmin, deleteMeal);

module.exports = router;
