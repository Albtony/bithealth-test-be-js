const express = require('express');
const router = express.Router(); 

const authenticateToken = require('../middleware/authenticateToken.middleware');
const authorizeRole = require('../middleware/authorizeRole.middleware');

const employeeRoutes = require('./employee.route');
const customerRoutes = require('./customer.route');
const authRoutes = require('./auth.route');
const roleRoutes = require('./role.route');

router.use('/auth', authRoutes);
router.use('/role', authenticateToken, roleRoutes);
router.use('/employees', authenticateToken, employeeRoutes);
router.use('/customers', authenticateToken, customerRoutes);

module.exports = router;