const db = require('../models');
const Attribute = db.Attribute;

const createAttribute = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'fail',
                message: 'Attribute name is required.',
                data: null,
                meta: {},
            });
        }

        const newAttribute = await Attribute.create({ name, description });

        res.status(201).json({
            status: 'success',
            message: 'Attribute created successfully.',
            data: newAttribute,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Attribute with this name already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error creating attribute.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating attribute.',
            error: error.message,
            meta: {},
        });
    }
};

const getAllAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.findAll();
        res.status(200).json({
            status: 'success',
            message: 'Attributes retrieved successfully.',
            data: attributes,
            meta: {
                total: attributes.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving attributes.',
            error: error.message,
            meta: {},
        });
    }
};

const getAttributeById = async (req, res) => {
    try {
        const { id } = req.params;
        const attribute = await Attribute.findByPk(id);

        if (!attribute) {
            return res.status(404).json({
                status: 'fail',
                message: 'Attribute not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Attribute retrieved successfully.',
            data: attribute,
            meta: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving attribute.',
            error: error.message,
            meta: {},
        });
    }
};

const updateAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name && description === undefined) {
            return res.status(400).json({
                status: 'fail',
                message: 'At least one field (name or description) is required for update.',
                data: null,
                meta: {},
            });
        }

        const updateFields = {};
        if (name) {
            updateFields.name = name;
        }
        if (description !== undefined) {
            updateFields.description = description;
        }

        const [affectedRowsCount] = await Attribute.update(updateFields, {
            where: { attribute_id: id },
        });

        if (affectedRowsCount === 0) {
            const attributeExists = await Attribute.findByPk(id);
            if (!attributeExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Attribute not found.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the attribute (data provided was identical).',
                    data: attributeExists,
                    meta: {},
                });
            }
        }

        const updatedAttribute = await Attribute.findByPk(id);
        res.status(200).json({
            status: 'success',
            message: 'Attribute updated successfully.',
            data: updatedAttribute,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Attribute with this name already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error updating attribute.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating attribute.',
            error: error.message,
            meta: {},
        });
    }
};

const deleteAttribute = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRowsCount = await Attribute.destroy({
            where: { attribute_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Attribute not found.',
                data: null,
                meta: {},
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting attribute.',
            error: error.message,
            meta: {},
        });
    }
};

module.exports = {
    createAttribute,
    getAllAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute,
};