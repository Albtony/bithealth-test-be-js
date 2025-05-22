const express = require('express');
const router = express.Router(); 
const attributeValueController = require('../controllers/attributeValue.controller'); 

router.get('/', attributeValueController.getAllAttributeValues);
router.get('/:id', attributeValueController.getAttributeValueById);
router.post('/', attributeValueController.createAttributeValue);
router.put('/:id', attributeValueController.updateAttributeValue);
router.delete('/:id', attributeValueController.deleteAttributeValue);

module.exports = router; 