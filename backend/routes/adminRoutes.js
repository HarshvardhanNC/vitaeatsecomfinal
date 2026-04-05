const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/dashboard').get(protect, isAdmin, getDashboardStats);
router.route('/users').get(protect, isAdmin, getUsers);

module.exports = router;
