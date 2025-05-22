const express = require('express');
const router = express.Router(); 
const attributeController = require('../controllers/attribute.controller'); 

router.get('/', attributeController.getAllAttributes);
router.get('/:id', attributeController.getAttributeById);
router.post('/', attributeController.createAttribute);
router.put('/:id', attributeController.updateAttribute);
router.delete('/:id', attributeController.deleteAttribute);

module.exports = router; 