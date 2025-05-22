const express = require('express');
const router = express.Router(); 

const authenticateToken = require('../middleware/authenticateToken.middleware');
const authorizeRole = require('../middleware/authorizeRole.middleware');

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
const saleOrderItemRoutes = require('./saleOrderItem.route');

router.use('/auth', authRoutes);
router.use('/role', authenticateToken, authorizeRole(['SUPERADMIN']), roleRoutes);
router.use('/employees', authenticateToken, authorizeRole(['ADMIN']), employeeRoutes); 
router.use('/customers', authenticateToken, authorizeRole(['ADMIN', 'STAFF', 'CUSTOMER']), customerRoutes); 
router.use('/address', authenticateToken, authorizeRole(['ADMIN', 'STAFF', 'CUSTOMER']), addressRoutes); 
router.use('/category', authenticateToken, authorizeRole(['ADMIN', 'STAFF']), categoryRoutes);
router.use('/attribute', authenticateToken, authorizeRole(['ADMIN', 'STAFF']), attributeRoutes);
router.use('/attributeValue', authenticateToken, authorizeRole(['ADMIN', 'STAFF']), attributeValueRoutes);
router.use('/productModel', authenticateToken, authorizeRole(['ADMIN', 'STAFF']), productModelRoutes);
router.use('/productVariant', authenticateToken, authorizeRole(['ADMIN', 'STAFF']), productVariantRoutes);
router.use('/saleOrder', authenticateToken, authorizeRole(['ADMIN', 'STAFF', 'CUSTOMER']), saleOrderRoutes); 
router.use('/saleOrderItem', authenticateToken, authorizeRole(['ADMIN', 'STAFF', 'CUSTOMER']), saleOrderItemRoutes); 
module.exports = router;