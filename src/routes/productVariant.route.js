const express = require('express');
const router = express.Router(); 
const productVariantController = require('../controllers/productVariant.controller'); 

router.get('/', productVariantController.getAllProductVariants);
router.get('/:id', productVariantController.getProductVariantById);
router.post('/', productVariantController.createProductVariant);
router.put('/:id', productVariantController.updateProductVariant);
router.delete('/:id', productVariantController.deleteProductVariant);

module.exports = router; 