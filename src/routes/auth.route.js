const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register/customer', authController.customerRegister);
router.post('/register/employee', authController.employeeRegister);
router.post('/login/customer', authController.customerLogin);
router.post('/login/employee', authController.employeeLogin);

module.exports = router;