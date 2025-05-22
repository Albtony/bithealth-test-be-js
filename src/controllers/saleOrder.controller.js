const db = require('../models');
const SaleOrder = db.SaleOrder;
const Employee = db.Employee;
const Customer = db.Customer;
const SaleOrderItem = db.SaleOrderItem; 

const createSaleOrder = async (req, res) => {
    try {
        const { employee_id, customer_id, customer_name, customer_email, items } = req.body;

        if (!employee_id || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Employee ID and at least one item are required.',
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

        let transaction;
        try {
            transaction = await db.sequelize.transaction();
            const newSaleOrder = await SaleOrder.create({
                employee_id,
                customer_id,
                customer_name,
                customer_email,
            }, { transaction });

            const orderItems = items.map(item => ({
                ...item,
                order_id: newSaleOrder.order_id,
                status: item.status || 'PENDING'
            }));

            await SaleOrderItem.bulkCreate(orderItems, { transaction });
            await transaction.commit();
            const createdOrderWithTotals = await SaleOrder.findByPk(newSaleOrder.order_id, {
                include: [{
                    model: SaleOrderItem,
                    as: 'items'
                }]
            });

            res.status(201).json({
                status: 'success',
                message: 'Sale order created successfully.',
                data: createdOrderWithTotals,
                meta: {},
            });
        } catch (txnError) {
            if (transaction) await transaction.rollback();
            throw txnError; 
        }

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
                { model: Employee, as: 'employee' },
                { model: Customer, as: 'customer' },
                { model: SaleOrderItem, as: 'items' } 
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
                { model: Employee, as: 'employee' },
                { model: Customer, as: 'customer' },
                { model: SaleOrderItem, as: 'items' } 
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
        const { employee_id, customer_id, customer_name, customer_email } = req.body;

        const updateFields = {};
        if (employee_id !== undefined) updateFields.employee_id = employee_id;
        if (customer_id !== undefined) updateFields.customer_id = customer_id;
        if (customer_name !== undefined) updateFields.customer_name = customer_name;
        if (customer_email !== undefined) updateFields.customer_email = customer_email;
        if (req.body.total_price !== undefined || req.body.total_billed_price !== undefined) {
            return res.status(400).json({
                status: 'fail',
                message: 'total_price and total_billed_price cannot be updated directly. They are calculated by hooks.',
                data: null,
                meta: {},
            });
        }

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
                { model: Employee, as: 'employee' },
                { model: Customer, as: 'customer' },
                { model: SaleOrderItem, as: 'items' } 
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