const db = require('../models');
const Customer = db.Customer;
const Address = db.Address;
const SaleOrder = db.SaleOrder;

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            include: [
                { model: db.Address, as: 'addresses' },
                { model: db.Role, as: 'role' },
                { model: db.SaleOrder, as: 'saleOrders' }
            ]
        });
        res.status(200).json({
            status: 'success',
            message: 'Customers fetched successfully.',
            data: customers,
            meta: { totalRecords: customers.length },
        });
    } catch (error) {
        console.error('[CustomerController]: Error fetching customers:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching customers',
            error: error.message,
        });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id, {
            include: [
                { model: db.Address, as: 'addresses' },
                { model: db.Role, as: 'role' },
                { model: db.SaleOrder, as: 'saleOrders' }
            ]
        });

        if (!customer) {
            return res.status(404).json({
                status: 'fail',
                message: 'Customer not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Customer fetched successfully.',
            data: customer,
            meta: {},
        });
    } catch (error) {
        console.error('[CustomerController]: Error fetching customer by ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching customer',
            error: error.message,
        });
    }
};

const createCustomer = async (req, res) => {
    try {
        const {
            username,
            password_hash,
            email,
            first_name,
            last_name,
            phone_number,
            loyalty_points,
            role_id,
            addresses
        } = req.body;

        if (!username || !password_hash || !email || !phone_number || !role_id) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required customer fields: username, password, email, phone, role_id.',
                data: null,
                meta: {},
            });
        }

        const newCustomer = await Customer.create({
            username,
            password_hash,
            email,
            first_name,
            last_name,
            phone_number,
            loyalty_points,
            role_id,
        });

        if (addresses && Array.isArray(addresses) && addresses.length > 0) {
            const customerAddresses = addresses.map(addr => ({
                ...addr,
                customer_id: newCustomer.customer_id
            }));
            await Address.bulkCreate(customerAddresses);
            await newCustomer.reload({
                include: [
                    { model: db.Address, as: 'addresses' },
                    { model: db.Role, as: 'role' }
                ]
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Customer created successfully.',
            data: newCustomer,
            meta: {},
        });
    } catch (error) {
        console.error('[CustomerController]: Error creating customer:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Username or email already exists.',
                error: error.message,
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating customer',
            error: error.message,
        });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { addresses, ...updateData } = req.body;

        delete updateData.customer_id;

        const [affectedRowsCount] = await Customer.update(updateData, {
            where: { customer_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Customer not found or no customer data changes were made.',
                data: null,
                meta: {},
            });
        }

        const updatedCustomer = await Customer.findByPk(id, {
            include: [
                { model: db.Address, as: 'addresses' },
                { model: db.Role, as: 'role' }
            ]
        });
        res.status(200).json({
            status: 'success',
            message: 'Customer updated successfully.',
            data: updatedCustomer,
            meta: {},
        });
    } catch (error) {
        console.error('[CustomerController]: Error updating customer:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Username or email already exists.',
                error: error.message,
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating customer',
            error: error.message,
        });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Customer.destroy({
            where: { customer_id: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Customer not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Customer deleted successfully.',
            data: null,
            meta: {},
        });
    } catch (error) {
        console.error('[CustomerController]: Error deleting customer:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting customer',
            error: error.message,
        });
    }
};

const getCustomerAddresses = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id, {
            include: [{ model: db.Address, as: 'addresses' }]
        });

        if (!customer) {
            return res.status(404).json({
                status: 'fail',
                message: 'Customer not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Customer addresses fetched successfully.',
            data: customer.addresses,
            meta: { totalRecords: customer.addresses ? customer.addresses.length : 0 },
        });
    } catch (error) {
        console.error('[CustomerController]: Error fetching customer addresses:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching customer addresses',
            error: error.message,
        });
    }
};

const getCustomerSaleOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id, {
            include: [{ model: db.SaleOrder, as: 'saleOrders' }]
        });

        if (!customer) {
            return res.status(404).json({
                status: 'fail',
                message: 'Customer not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Customer sale orders fetched successfully.',
            data: customer.saleOrders,
            meta: { totalRecords: customer.saleOrders ? customer.saleOrders.length : 0 },
        });
    } catch (error) {
        console.error('[CustomerController]: Error fetching customer sale orders:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching customer sale orders',
            error: error.message,
        });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerAddresses,
    getCustomerSaleOrders,
};