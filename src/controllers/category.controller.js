const db = require('../models');
const Category = db.Category;
const Attribute = db.Attribute;

const includeAttributes = {
    include: [{ model: db.Attribute, as: 'attributes' }]
};

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
        const categories = await Category.findAll(includeAttributes);
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
        const category = await Category.findByPk(id, includeAttributes);
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

        const updateFields = {};
        if (category_name !== undefined) {
            updateFields.category_name = category_name;
        }

        if (Object.keys(updateFields).length === 0) {
            const categoryExists = await Category.findByPk(id, includeAttributes);
            if (categoryExists) {
                return res.status(200).json({
                    status: 'success',
                    message: 'No updatable fields provided or no changes were made to category name.',
                    data: categoryExists,
                    meta: {},
                });
            } else {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Category not found or no updatable fields provided.',
                    data: null,
                    meta: {},
                });
            }
        }

        const [affectedRowsCount] = await Category.update(updateFields, {
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
                const existingCategoryWithAttributes = await Category.findByPk(id, includeAttributes);
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the category (data provided was identical).',
                    data: existingCategoryWithAttributes,
                    meta: {},
                });
            }
        }

        const updatedCategory = await Category.findByPk(id, includeAttributes);
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

const addAttributesToCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { attribute_ids } = req.body;
        if (!attribute_ids || !Array.isArray(attribute_ids) || attribute_ids.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'An array of attribute_ids is required.',
                data: null,
                meta: {},
            });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found.',
                data: null,
                meta: {},
            });
        }

        const attributes = await Attribute.findAll({
            where: { attribute_id: attribute_ids },
        });

        if (attributes.length !== attribute_ids.length) {
            const existingAttributeIds = attributes.map(attr => attr.attribute_id);
            const invalidAttributeIds = attribute_ids.filter(id => !existingAttributeIds.includes(id));

            return res.status(404).json({
                status: 'fail',
                message: 'One or more provided attribute IDs do not exist.',
                invalid_ids: invalidAttributeIds,
                data: null,
                meta: {},
            });
        }

        await category.addAttributes(attributes);
        const updatedCategory = await Category.findByPk(categoryId, includeAttributes);
        res.status(200).json({
            status: 'success',
            message: 'Attributes added to category successfully.',
            data: updatedCategory,
            meta: {},
        });
    } catch (error) {
        console.error("Error adding attributes to category:", error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add attributes to category.',
            error: error.message,
            meta: {},
        });
    }
};

const removeAttributesFromCategory = async (req, res) => {
    try {
        const { categoryId, attributeId } = req.params;
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                status: 'fail',
                message: 'Category not found.',
                data: null,
                meta: {},
            });
        }

        const attribute = await Attribute.findByPk(attributeId);
        if (!attribute) {
            return res.status(404).json({
                status: 'fail',
                message: 'Attribute not found.',
                data: null,
                meta: {},
            });
        }

        const removed = await category.removeAttribute(attribute);
        if (!removed) {
            return res.status(404).json({
                status: 'fail',
                message: 'Association between category and attribute not found or already removed.',
                data: null,
                meta: {},
            });
        }

        const updatedCategory = await Category.findByPk(categoryId, includeAttributes);
        res.status(200).json({
            status: 'success',
            message: 'Attribute removed from category successfully.',
            data: updatedCategory,
            meta: {},
        });
    } catch (error) {
        console.error("Error removing attribute from category:", error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to remove attribute from category.',
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
    addAttributesToCategory,
    removeAttributesFromCategory,
};