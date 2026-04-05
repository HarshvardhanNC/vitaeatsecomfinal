const express = require('express');
const router = express.Router();
const { updateHealthProfile, getNutritionDashboard, getUserProfile, toggleNewsletterSubscription } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/profile/health', protect, updateHealthProfile);
router.get('/dashboard/nutrition', protect, getNutritionDashboard);
router.get('/profile', protect, getUserProfile);
router.post('/newsletter', toggleNewsletterSubscription);

module.exports = router;
