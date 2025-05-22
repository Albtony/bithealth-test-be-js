const db = require('../models');
const ProductVariant = db.ProductVariant;
const ProductModel = db.ProductModel;

const createProductVariant = async (req, res) => {
    try {
        const { model_id, sku, price, stock_quantity, variant_image_url } = req.body;

        if (!model_id || !sku || price === undefined || price === null || stock_quantity === undefined || stock_quantity === null) {
            return res.status(400).json({
                status: 'fail',
                message: 'Model ID, SKU, price, and stock quantity are required.',
                data: null,
                meta: {},
            });
        }

        const productModel = await ProductModel.findByPk(model_id);
        if (!productModel) {
            return res.status(404).json({
                status: 'fail',
                message: 'Associated product model not found.',
                data: null,
                meta: {},
            });
        }

        const newProductVariant = await ProductVariant.create({
            model_id,
            sku,
            price,
            stock_quantity,
            variant_image_url,
        });

        res.status(201).json({
            status: 'success',
            message: 'Product variant created successfully.',
            data: newProductVariant,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Product variant with this SKU already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'The specified model_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error creating product variant.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating product variant.',
            error: error.message,
            meta: {},
        });
    }
};

const getAllProductVariants = async (req, res) => {
    try {
        const productVariants = await ProductVariant.findAll({
            include: [{ model: db.ProductModel, as: 'productModel' }]
        });
        res.status(200).json({
            status: 'success',
            message: 'Product variants retrieved successfully.',
            data: productVariants,
            meta: {
                total: productVariants.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving product variants.',
            error: error.message,
            meta: {},
        });
    }
};

const getProductVariantById = async (req, res) => {
    try {
        const { id } = req.params;
        const productVariant = await ProductVariant.findByPk(id, {
            include: [{ model: db.ProductModel, as: 'productModel' }]
        });

        if (!productVariant) {
            return res.status(404).json({
                status: 'fail',
                message: 'Product variant not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product variant retrieved successfully.',
            data: productVariant,
            meta: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving product variant.',
            error: error.message,
            meta: {},
        });
    }
};

const updateProductVariant = async (req, res) => {
    try {
        const { id } = req.params;
        const { model_id, sku, price, stock_quantity, variant_image_url } = req.body;

        const updateFields = {};
        if (model_id !== undefined) updateFields.model_id = model_id;
        if (sku !== undefined) updateFields.sku = sku;
        if (price !== undefined) updateFields.price = price;
        if (stock_quantity !== undefined) updateFields.stock_quantity = stock_quantity;
        if (variant_image_url !== undefined) updateFields.variant_image_url = variant_image_url;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'At least one field is required for update.',
                data: null,
                meta: {},
            });
        }

        if (model_id !== undefined) {
            const productModel = await ProductModel.findByPk(model_id);
            if (!productModel) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated product model not found.',
                    data: null,
                    meta: {},
                });
            }
        }

        const [affectedRowsCount] = await ProductVariant.update(updateFields, {
            where: { variant_id: id },
        });

        if (affectedRowsCount === 0) {
            const productVariantExists = await ProductVariant.findByPk(id);
            if (!productVariantExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Product variant not found.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the product variant (data provided was identical).',
                    data: productVariantExists,
                    meta: {},
                });
            }
        }

        const updatedProductVariant = await ProductVariant.findByPk(id, {
            include: [{ model: db.ProductModel, as: 'productModel' }]
        });
        res.status(200).json({
            status: 'success',
            message: 'Product variant updated successfully.',
            data: updatedProductVariant,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Product variant with this SKU already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'The specified model_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error updating product variant.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating product variant.',
            error: error.message,
            meta: {},
        });
    }
};

const deleteProductVariant = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRowsCount = await ProductVariant.destroy({
            where: { variant_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Product variant not found.',
                data: null,
                meta: {},
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting product variant.',
            error: error.message,
            meta: {},
        });
    }
};

module.exports = {
    createProductVariant,
    getAllProductVariants,
    getProductVariantById,
    updateProductVariant,
    deleteProductVariant,
};