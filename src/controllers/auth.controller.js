const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt.config');

const db = require('../models');
const Customer = db.Customer;
const Employee = db.Employee; 
const Role = db.Role; 

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const SALT_ROUNDS = 10;

const customerRegister = async (req, res) => {
    try {
        const {
            username,
            password,
            email,
            first_name,
            last_name,
            phone_number,
        } = req.body;

        if (!username || !password || !email || !phone_number) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required fields.',
            });
        }

        const customerRole = await Role.findOne({ where: { role_name: 'CUSTOMER' } });
        if (!customerRole) {
            return res.status(500).json({
                status: 'error',
                message: 'CUSTOMER role not found in the system.',
            });
        }

        const existingUser = await Customer.findOne({
            where: { [db.Sequelize.Op.or]: [{ username }, { email }] },
        });

        if (existingUser) {
            return res.status(409).json({
                status: 'fail',
                message: 'Username or email already in use.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newCustomer = await Customer.create({
            username,
            password_hash: hashedPassword,
            email,
            first_name,
            last_name,
            phone_number,
            role_id: customerRole.role_id, 
        });

        return res.status(201).json({
            status: 'success',
            message: 'Customer registered successfully.',
            data: {
                user: {
                    id: newCustomer.customer_id,
                    username: newCustomer.username,
                    email: newCustomer.email,
                    role: customerRole.role_name,
                },
            },
        });
    } catch (error) {
        console.error('[AuthController]: Customer registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error during customer registration',
            error: error.message,
        });
    }
};

const employeeRegister = async (req, res) => {
    try {
        const {
            username,
            password,
            email,
            first_name,
            last_name,
            phone_number,
            job_title, // optional
        } = req.body;

        // Validate only required fields (job_title is nullable)
        if (!username || !password || !email || !phone_number) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required fields.',
            });
        }

        const staffRole = await Role.findOne({ where: { role_name: 'STAFF' } });
        if (!staffRole) {
            return res.status(500).json({
                status: 'error',
                message: 'STAFF role not found in the system.',
            });
        }

        const existingEmployee = await Employee.findOne({
            where: { [db.Sequelize.Op.or]: [{ username }, { email }] },
        });

        if (existingEmployee) {
            return res.status(409).json({
                status: 'fail',
                message: 'Username or email already in use.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newEmployee = await Employee.create({
            username,
            password_hash: hashedPassword,
            email,
            first_name,
            last_name,
            phone_number,
            job_title: job_title || null, // explicitly set null if missing
            is_active: true,
            role_id: staffRole.role_id,
        });

        return res.status(201).json({
            status: 'success',
            message: 'Employee registered successfully.',
            data: {
                user: {
                    id: newEmployee.employee_id,
                    username: newEmployee.username,
                    email: newEmployee.email,
                    role: staffRole.role_name,
                },
            },
        });
    } catch (error) {
        console.error('[AuthController]: Employee registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error during employee registration',
            error: error.message,
        });
    }
};

const customerLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body; 
        if (!identifier || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username/Email and password are required.',
            });
        }

        const customer = await Customer.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { username: identifier },
                    { email: identifier }
                ]
            },
            include: [{ model: Role, as: 'role' }] 
        });

        if (!customer) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid credentials.',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid credentials.',
            });
        }

        const tokenPayload = {
            id: customer.customer_id,
            type: 'customer',
            role_name: customer.role ? customer.role.role_name : 'CUSTOMER',
        };

        const token = generateToken(tokenPayload);
        res.status(200).json({
            status: 'success',
            message: 'Customer logged in successfully.',
            data: {
                token,
                user: {
                    id: customer.customer_id,
                    username: customer.username,
                    email: customer.email,
                    role: tokenPayload.role_name,
                },
            },
        });
    } catch (error) {
        console.error('[AuthController]: Customer login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error during customer login',
            error: error.message,
        });
    }
};

const employeeLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body; 
        if (!identifier || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Username/Email and password are required.',
            });
        }

        const employee = await Employee.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { username: identifier },
                    { email: identifier }   
                ]
            },
            include: [{ model: Role, as: 'role' }] 
        });

        if (!employee) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid credentials.',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid credentials.',
            });
        }

        const tokenPayload = {
            id: employee.employee_id, 
            type: 'employee',
            role_name: employee.role ? employee.role.role_name : 'STAFF', 
        };

        const token = generateToken(tokenPayload);
        res.status(200).json({
            status: 'success',
            message: 'Employee logged in successfully.',
            data: {
                token,
                user: {
                    id: employee.employee_id,
                    username: employee.username,
                    email: employee.email,
                    role: tokenPayload.role_name,
                },
            },
        });
    } catch (error) {
        console.error('[AuthController]: Employee login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error during employee login',
            error: error.message,
        });
    }
};

module.exports = {
    customerLogin,
    employeeLogin,
    customerRegister,
    employeeRegister,
};