const db = require('../models');
const SaleOrder = db.SaleOrder;
const Employee = db.Employee;
const Customer = db.Customer;

const createSaleOrder = async (req, res) => {
    try {
        const { employee_id, customer_id, total_price, status, customer_name, customer_email } = req.body;

        if (!employee_id || total_price === undefined || total_price === null || !status) {
            return res.status(400).json({
                status: 'fail',
                message: 'Employee ID, total amount, and status are required.',
                data: null,
                meta: {},
            });
        }

        const employee = await Employee.findByPk(employee_id);
        if (!employee) {
            return res.status(404).json({
                status: 'fail',
                message: 'Associated employee not found.',
                data: null,
                meta: {},
            });
        }

        if (customer_id) {
            const customer = await Customer.findByPk(customer_id);
            if (!customer) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated customer not found.',
                    data: null,
                    meta: {},
                });
            }
        }

        const newSaleOrder = await SaleOrder.create({
            employee_id,
            customer_id,
            total_price,
            status,
            customer_name,
            customer_email,
        });

        res.status(201).json({
            status: 'success',
            message: 'Sale order created successfully.',
            data: newSaleOrder,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'A specified employee_id or customer_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error creating sale order.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating sale order.',
            error: error.message,
            meta: {},
        });
    }
};

const getAllSaleOrders = async (req, res) => {
    try {
        const saleOrders = await SaleOrder.findAll({
            include: [
                { model: db.Employee, as: 'employee' },
                { model: db.Customer, as: 'customer' },
            ]
        });
        res.status(200).json({
            status: 'success',
            message: 'Sale orders retrieved successfully.',
            data: saleOrders,
            meta: {
                total: saleOrders.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving sale orders.',
            error: error.message,
            meta: {},
        });
    }
};

const getSaleOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const saleOrder = await SaleOrder.findByPk(id, {
            include: [
                { model: db.Employee, as: 'employee' },
                { model: db.Customer, as: 'customer' },
            ]
        });

        if (!saleOrder) {
            return res.status(404).json({
                status: 'fail',
                message: 'Sale order not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Sale order retrieved successfully.',
            data: saleOrder,
            meta: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving sale order.',
            error: error.message,
            meta: {},
        });
    }
};

const updateSaleOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_id, customer_id, total_price, status, customer_name, customer_email } = req.body;

        const updateFields = {};
        if (employee_id !== undefined) updateFields.employee_id = employee_id;
        if (customer_id !== undefined) updateFields.customer_id = customer_id;
        if (total_price !== undefined) updateFields.total_price = total_price;
        if (status !== undefined) updateFields.status = status;
        if (customer_name !== undefined) updateFields.customer_name = customer_name;
        if (customer_email !== undefined) updateFields.customer_email = customer_email;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'At least one field is required for update.',
                data: null,
                meta: {},
            });
        }

        if (employee_id !== undefined) {
            const employee = await Employee.findByPk(employee_id);
            if (!employee) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated employee not found for update.',
                    data: null,
                    meta: {},
                });
            }
        }

        if (customer_id !== undefined && customer_id !== null) {
            const customer = await Customer.findByPk(customer_id);
            if (!customer) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated customer not found for update.',
                    data: null,
                    meta: {},
                });
            }
        }

        const [affectedRowsCount] = await SaleOrder.update(updateFields, {
            where: { order_id: id },
        });

        if (affectedRowsCount === 0) {
            const saleOrderExists = await SaleOrder.findByPk(id);
            if (!saleOrderExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Sale order not found.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the sale order (data provided was identical).',
                    data: saleOrderExists,
                    meta: {},
                });
            }
        }

        const updatedSaleOrder = await SaleOrder.findByPk(id, {
            include: [
                { model: db.Employee, as: 'employee' },
                { model: db.Customer, as: 'customer' },
            ]
        });
        res.status(200).json({
            status: 'success',
            message: 'Sale order updated successfully.',
            data: updatedSaleOrder,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'A specified employee_id or customer_id does not exist for update.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error updating sale order.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating sale order.',
            error: error.message,
            meta: {},
        });
    }
};

const deleteSaleOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRowsCount = await SaleOrder.destroy({
            where: { order_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Sale order not found.',
                data: null,
                meta: {},
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting sale order.',
            error: error.message,
            meta: {},
        });
    }
};

module.exports = {
    createSaleOrder,
    getAllSaleOrders,
    getSaleOrderById,
    updateSaleOrder,
    deleteSaleOrder,
};