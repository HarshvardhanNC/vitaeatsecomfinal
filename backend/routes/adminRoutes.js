const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/dashboard').get(protect, isAdmin, getDashboardStats);

module.exports = router;
