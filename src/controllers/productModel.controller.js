const db = require('../models');
const ProductModel = db.ProductModel;
const Category = db.Category;

const createProductModel = async (req, res) => {
    try {
        const { name, description, category_id, brand, base_image_url, base_price } = req.body;

        if (!name || base_price === undefined || base_price === null) {
            return res.status(400).json({
                status: 'fail',
                message: 'Product model name and base price are required.',
                data: null,
                meta: {},
            });
        }

        if (category_id !== undefined && category_id !== null) {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated category not found.',
                    data: null,
                    meta: {},
                });
            }
        }

        const newProductModel = await ProductModel.create({
            name,
            description,
            category_id,
            brand,
            base_image_url,
            base_price,
        });

        res.status(201).json({
            status: 'success',
            message: 'Product model created successfully.',
            data: newProductModel,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Product model with this name already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'The specified category_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error creating product model.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating product model.',
            error: error.message,
            meta: {},
        });
    }
};

const getAllProductModels = async (req, res) => {
    try {
        const productModels = await ProductModel.findAll({
            include: [{ model: db.Category, as: 'category' }]
        });
        res.status(200).json({
            status: 'success',
            message: 'Product models retrieved successfully.',
            data: productModels,
            meta: {
                total: productModels.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving product models.',
            error: error.message,
            meta: {},
        });
    }
};

const getProductModelById = async (req, res) => {
    try {
        const { id } = req.params;
        const productModel = await ProductModel.findByPk(id, {
            include: [{ model: db.Category, as: 'category' }]
        });

        if (!productModel) {
            return res.status(404).json({
                status: 'fail',
                message: 'Product model not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product model retrieved successfully.',
            data: productModel,
            meta: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving product model.',
            error: error.message,
            meta: {},
        });
    }
};

const updateProductModel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category_id, brand, base_image_url, base_price } = req.body;

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (category_id !== undefined) updateFields.category_id = category_id;
        if (brand !== undefined) updateFields.brand = brand;
        if (base_image_url !== undefined) updateFields.base_image_url = base_image_url;
        if (base_price !== undefined) updateFields.base_price = base_price;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'At least one field is required for update.',
                data: null,
                meta: {},
            });
        }

        if (category_id !== undefined && category_id !== null) {
            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Associated category not found.',
                    data: null,
                    meta: {},
                });
            }
        }

        const [affectedRowsCount] = await ProductModel.update(updateFields, {
            where: { model_id: id },
        });

        if (affectedRowsCount === 0) {
            const productModelExists = await ProductModel.findByPk(id);
            if (!productModelExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Product model not found.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the product model (data provided was identical).',
                    data: productModelExists,
                    meta: {},
                });
            }
        }

        const updatedProductModel = await ProductModel.findByPk(id, {
            include: [{ model: db.Category, as: 'category' }]
        });
        res.status(200).json({
            status: 'success',
            message: 'Product model updated successfully.',
            data: updatedProductModel,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Product model with this name already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'The specified category_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error updating product model.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating product model.',
            error: error.message,
            meta: {},
        });
    }
};

const deleteProductModel = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRowsCount = await ProductModel.destroy({
            where: { model_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Product model not found.',
                data: null,
                meta: {},
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting product model.',
            error: error.message,
            meta: {},
        });
    }
};

module.exports = {
    createProductModel,
    getAllProductModels,
    getProductModelById,
    updateProductModel,
    deleteProductModel,
};