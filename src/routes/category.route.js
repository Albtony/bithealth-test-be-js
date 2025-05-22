const express = require('express');
const router = express.Router(); 
const categoryController = require('../controllers/category.controller'); 

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

router.post('/:categoryId/attributes', categoryController.addAttributesToCategory);
router.delete('/:categoryId/attributes/:attributeId', categoryController.removeAttributesFromCategory);

module.exports = router; 