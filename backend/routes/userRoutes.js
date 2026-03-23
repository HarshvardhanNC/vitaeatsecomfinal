const express = require('express');
const router = express.Router();
const { updateHealthProfile, getNutritionDashboard, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/profile/health', protect, updateHealthProfile);
router.get('/dashboard/nutrition', protect, getNutritionDashboard);
router.get('/profile', protect, getUserProfile);

module.exports = router;
