const express = require('express');
const router = express.Router(); 
const saleOrderItemController = require('../controllers/saleOrderItem.controller'); 

router.get('/', saleOrderItemController.getAllSaleOrderItems);
router.get('/:id', saleOrderItemController.getSaleOrderItemById);
router.post('/', saleOrderItemController.createSaleOrderItem);
router.put('/:id', saleOrderItemController.updateSaleOrderItem);
router.delete('/:id', saleOrderItemController.deleteSaleOrderItem);

module.exports = router; 