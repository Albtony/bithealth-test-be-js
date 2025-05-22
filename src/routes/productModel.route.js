const express = require('express');
const router = express.Router(); 
const productModelController = require('../controllers/productModel.controller'); 

router.get('/', productModelController.getAllProductModels);
router.get('/:id', productModelController.getProductModelById);
router.post('/', productModelController.createProductModel);
router.put('/:id', productModelController.updateProductModel);
router.delete('/:id', productModelController.deleteProductModel);

module.exports = router; 