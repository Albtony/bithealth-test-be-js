const db = require('../models');
const Category = db.Category;

const createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category name is required.',
                data: null,
                meta: {},
            });
        }

        const newCategory = await Category.create({ category_name });

        res.status(201).json({
            status: 'success',
            message: 'Category created successfully.',
            data: newCategory,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Category with this name already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error creating category.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating category.',
            error: error.message,
            meta: {},
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({
            status: 'success',
            message: 'Categories retrieved successfully.',
            data: categories,
            meta: {
                total: categories.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving categories.',
            error: error.message,
            meta: {},
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Category retrieved successfully.',
            data: category,
            meta: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving category.',
            error: error.message,
            meta: {},
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({
                status: 'fail',
                message: 'Category name is required for update.',
                data: null,
                meta: {},
            });
        }

        const [affectedRowsCount] = await Category.update({ category_name }, {
            where: { category_id: id },
        });

        if (affectedRowsCount === 0) {
            const categoryExists = await Category.findByPk(id);
            if (!categoryExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Category not found.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the category (data provided was identical).',
                    data: categoryExists,
                    meta: {},
                });
            }
        }

        const updatedCategory = await Category.findByPk(id);
        res.status(200).json({
            status: 'success',
            message: 'Category updated successfully.',
            data: updatedCategory,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Category with this name already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error updating category.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating category.',
            error: error.message,
            meta: {},
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRowsCount = await Category.destroy({
            where: { category_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found.',
                data: null,
                meta: {},
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting category.',
            error: error.message,
            meta: {},
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};