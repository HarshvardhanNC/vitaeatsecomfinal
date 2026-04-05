const PurchaseOrder = require('../models/PurchaseOrder');

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private/Admin
const getPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find({}).populate('supplier', 'name contact');
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a purchase order
// @route   POST /api/purchase-orders
// @access  Private/Admin
const createPurchaseOrder = async (req, res) => {
  try {
    const { supplier, ingredient, quantity, urgency, notes } = req.body;

    const po = new PurchaseOrder({
      supplier,
      ingredient,
      quantity,
      urgency,
      notes
    });

    const createdPO = await po.save();
    res.status(201).json(createdPO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update purchase order status
// @route   PUT /api/purchase-orders/:id/status
// @access  Private/Admin
const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const po = await PurchaseOrder.findById(req.params.id);

    if (po) {
      po.status = status;
      const updatedPO = await po.save();
      res.json(updatedPO);
    } else {
      res.status(404).json({ message: 'Purchase Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus };
