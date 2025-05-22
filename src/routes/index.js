const express = require('express');
const router = express.Router(); 

const employeeRoutes = require('./employee.route');
const customerRoutes = require('./customer.route');
const authRoutes = require('./auth.route');
const roleRoutes = require('./role.route');

router.use('/employees', employeeRoutes);
router.use('/customers', customerRoutes);
router.use('/auth', authRoutes);
router.use('/role', roleRoutes);

module.exports = router;