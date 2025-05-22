const express = require('express');
const router = express.Router(); 
const saleOrderController = require('../controllers/saleOrder.controller'); 

router.get('/', saleOrderController.getAllSaleOrders);
router.get('/:id', saleOrderController.getSaleOrderById);
router.post('/', saleOrderController.createSaleOrder);
router.put('/:id', saleOrderController.updateSaleOrder);
router.delete('/:id', saleOrderController.deleteSaleOrder);

module.exports = router; 