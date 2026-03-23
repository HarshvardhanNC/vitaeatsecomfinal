const express = require('express');
const router = express.Router();
const { registerUser, authUser, authAdmin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/admin-login', authAdmin);

module.exports = router;
