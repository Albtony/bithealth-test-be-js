const express = require('express');
const router = express.Router(); 

const employeeRoutes = require('./employee.route');
const customerRoutes = require('./customer.route');

router.use('/employees', employeeRoutes);
router.use('/customers', customerRoutes);

module.exports = router;