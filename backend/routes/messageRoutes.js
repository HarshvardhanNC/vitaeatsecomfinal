const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').post(sendMessage).get(protect, isAdmin, getMessages);

module.exports = router;
