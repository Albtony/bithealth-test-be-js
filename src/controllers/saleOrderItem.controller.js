const db = require('../models');
const SaleOrderItem = db.SaleOrderItem;
const SaleOrder = db.SaleOrder;
const ProductVariant = db.ProductVariant;

const createSaleOrderItem = async (req, res) => {
    try {
        const { order_id, variant_id, quantity, unit_price, subtotal } = req.body;

        if (!order_id || !variant_id || quantity === undefined || quantity === null || unit_price === undefined || unit_price === null || subtotal === undefined || subtotal === null) {
            return res.status(400).json({
                status: 'fail',
                message: 'Order ID, variant ID, quantity, unit price, and subtotal are required.',
                data: null,
                meta: {},
            });
        }

        const order = await SaleOrder.findByPk(order_id);
        if (!order) {
            return res.status(404).json({
                status: 'fail',
                message: 'Associated sale order not found.',
                data: null,
                meta: {},
            });
        }

        const variant = await ProductVariant.findByPk(variant_id);
        if (!variant) {
            return res.status(404).json({
                status: 'fail',
                message: 'Associated product variant not found.',
                data: null,
                meta: {},
            });
        }

        const newSaleOrderItem = await SaleOrderItem.create({
            order_id,
            variant_id,
            quantity,
            unit_price,
            subtotal,
        });

        res.status(201).json({
            status: 'success',
            message: 'Sale order item created successfully.',
            data: newSaleOrderItem,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'A specified order_id or variant_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error creating sale order item.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating sale order item.',
            error: error.message,
            meta: {},
        });
    }
};

const getAllSaleOrderItems = async (req, res) => {
    try {
        const saleOrderItems = await SaleOrderItem.findAll({
            include: [
                { model: db.SaleOrder, as: 'order' },
                { model: db.ProductVariant, as: 'variant' },
            ]
        });
        res.status(200).json({
            status: 'success',
            message: 'Sale order items retrieved successfully.',
            data: saleOrderItems,
            meta: {
                total: saleOrderItems.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving sale order items.',
            error: error.message,
            meta: {},
        });
    }
};

const getSaleOrderItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const saleOrderItem = await SaleOrderItem.findByPk(id, {
            include: [
                { model: db.SaleOrder, as: 'order' },
                { model: db.ProductVariant, as: 'variant' },
            ]
        });

        if (!saleOrderItem) {
            return res.status(404).json({
                status: 'fail',
                message: 'Sale order item not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Sale order item retrieved successfully.',
            data: saleOrderItem,
            meta: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving sale order item.',
            error: error.message,
            meta: {},
        });
    }
};

const updateSaleOrderItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { order_id, variant_id, quantity, unit_price, subtotal } = req.body;

        const updateFields = {};
        if (order_id !== undefined) updateFields.order_id = order_id;
        if (variant_id !== undefined) updateFields.variant_id = variant_id;
        if (quantity !== undefined) updateFields.quantity = quantity;
        if (unit_price !== undefined) updateFields.unit_price = unit_price;
        if (subtotal !== undefined) updateFields.subtotal = subtotal;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'At least one field is required for update.',
                data: null,
                meta: {},
            });
        }

        if (order_id !== undefined) {
            const order = await SaleOrder.findByPk(order_id);
            if (!order) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated sale order not found for update.',
                    data: null,
                    meta: {},
                });
            }
        }

        if (variant_id !== undefined) {
            const variant = await ProductVariant.findByPk(variant_id);
            if (!variant) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated product variant not found for update.',
                    data: null,
                    meta: {},
                });
            }
        }

        const [affectedRowsCount] = await SaleOrderItem.update(updateFields, {
            where: { order_item_id: id },
        });

        if (affectedRowsCount === 0) {
            const saleOrderItemExists = await SaleOrderItem.findByPk(id);
            if (!saleOrderItemExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Sale order item not found.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the sale order item (data provided was identical).',
                    data: saleOrderItemExists,
                    meta: {},
                });
            }
        }

        const updatedSaleOrderItem = await SaleOrderItem.findByPk(id, {
            include: [
                { model: db.SaleOrder, as: 'order' },
                { model: db.ProductVariant, as: 'variant' },
            ]
        });
        res.status(200).json({
            status: 'success',
            message: 'Sale order item updated successfully.',
            data: updatedSaleOrderItem,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'A specified order_id or variant_id does not exist for update.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error updating sale order item.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating sale order item.',
            error: error.message,
            meta: {},
        });
    }
};

const deleteSaleOrderItem = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRowsCount = await SaleOrderItem.destroy({
            where: { order_item_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Sale order item not found.',
                data: null,
                meta: {},
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting sale order item.',
            error: error.message,
            meta: {},
        });
    }
};

module.exports = {
    createSaleOrderItem,
    getAllSaleOrderItems,
    getSaleOrderItemById,
    updateSaleOrderItem,
    deleteSaleOrderItem,
};