const express = require('express');
const router = express.Router(); 

const authenticateToken = require('../middleware/authenticateToken.middleware');

const employeeRoutes = require('./employee.route');
const customerRoutes = require('./customer.route');
const authRoutes = require('./auth.route');
const roleRoutes = require('./role.route');
const addressRoutes = require('./address.route');
const categoryRoutes = require('./category.route');
const attributeRoutes = require('./attribute.route');
const attributeValueRoutes = require('./attributeValue.route');
const productModelRoutes = require('./productModel.route');
const productVariantRoutes = require('./productVariant.route');
const saleOrderRoutes = require('./saleOrder.route');

router.use('/auth', authRoutes);
router.use('/role', authenticateToken, roleRoutes);
router.use('/employees', authenticateToken, employeeRoutes);
router.use('/customers', authenticateToken, customerRoutes);
router.use('/address', authenticateToken, addressRoutes);
router.use('/category', authenticateToken, categoryRoutes);
router.use('/attribute', authenticateToken, attributeRoutes);
router.use('/attributeValue', authenticateToken, attributeValueRoutes);
router.use('/productModel', authenticateToken, productModelRoutes);
router.use('/productVariant', authenticateToken, productVariantRoutes);
router.use('/saleOrder', authenticateToken, saleOrderRoutes);

module.exports = router;