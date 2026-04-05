const express = require('express');
const router = express.Router();
const { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus } = require('../controllers/purchaseOrderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, isAdmin, getPurchaseOrders)
  .post(protect, isAdmin, createPurchaseOrder);

router.route('/:id/status')
  .put(protect, isAdmin, updatePurchaseOrderStatus);

module.exports = router;
