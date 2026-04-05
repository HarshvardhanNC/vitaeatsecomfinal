const express = require('express');
const router = express.Router();
const { getSuppliers, addSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, isAdmin, getSuppliers)
  .post(protect, isAdmin, addSupplier);

router.route('/:id')
  .delete(protect, isAdmin, deleteSupplier);

module.exports = router;
