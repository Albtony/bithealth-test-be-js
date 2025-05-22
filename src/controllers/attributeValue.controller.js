const db = require('../models');
const AttributeValue = db.AttributeValue;
const Attribute = db.Attribute;

const createAttributeValue = async (req, res) => {
    try {
        const { attribute_id, value, price_modifier } = req.body;

        if (!attribute_id || !value || price_modifier === undefined || price_modifier === null) {
            return res.status(400).json({
                status: 'fail',
                message: 'Attribute ID, value, and price modifier are required.',
                data: null,
                meta: {},
            });
        }

        const attribute = await Attribute.findByPk(attribute_id);
        if (!attribute) {
            return res.status(404).json({
                status: 'fail',
                message: 'Parent attribute not found.',
                data: null,
                meta: {},
            });
        }

        const newAttributeValue = await AttributeValue.create({
            attribute_id,
            value,
            price_modifier,
        });

        res.status(201).json({
            status: 'success',
            message: 'Attribute value created successfully.',
            data: newAttributeValue,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Attribute value with this attribute ID and value already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'The specified attribute_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error creating attribute value.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating attribute value.',
            error: error.message,
            meta: {},
        });
    }
};

const getAllAttributeValues = async (req, res) => {
    try {
        const attributeValues = await AttributeValue.findAll({
            include: [{ model: db.Attribute, as: 'attribute' }]
        });
        res.status(200).json({
            status: 'success',
            message: 'Attribute values retrieved successfully.',
            data: attributeValues,
            meta: {
                total: attributeValues.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving attribute values.',
            error: error.message,
            meta: {},
        });
    }
};

const getAttributeValueById = async (req, res) => {
    try {
        const { id } = req.params;
        const attributeValue = await AttributeValue.findByPk(id, {
            include: [{ model: db.Attribute, as: 'attribute' }]
        });

        if (!attributeValue) {
            return res.status(404).json({
                status: 'fail',
                message: 'Attribute value not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Attribute value retrieved successfully.',
            data: attributeValue,
            meta: {},
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving attribute value.',
            error: error.message,
            meta: {},
        });
    }
};

const updateAttributeValue = async (req, res) => {
    try {
        const { id } = req.params;
        const { attribute_id, value, price_modifier } = req.body;

        const updateFields = {};
        if (attribute_id !== undefined) updateFields.attribute_id = attribute_id;
        if (value !== undefined) updateFields.value = value;
        if (price_modifier !== undefined) updateFields.price_modifier = price_modifier;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'At least one field (attribute_id, value, or price_modifier) is required for update.',
                data: null,
                meta: {},
            });
        }

        if (attribute_id !== undefined) {
            const attribute = await Attribute.findByPk(attribute_id);
            if (!attribute) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Parent attribute not found.',
                    data: null,
                    meta: {},
                });
            }
        }

        const [affectedRowsCount] = await AttributeValue.update(updateFields, {
            where: { attribute_values_id: id },
        });

        if (affectedRowsCount === 0) {
            const attributeValueExists = await AttributeValue.findByPk(id);
            if (!attributeValueExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Attribute value not found.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the attribute value (data provided was identical).',
                    data: attributeValueExists,
                    meta: {},
                });
            }
        }

        const updatedAttributeValue = await AttributeValue.findByPk(id, {
            include: [{ model: db.Attribute, as: 'attribute' }]
        });
        res.status(200).json({
            status: 'success',
            message: 'Attribute value updated successfully.',
            data: updatedAttributeValue,
            meta: {},
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Attribute value with this attribute ID and value already exists.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({
                status: 'fail',
                message: 'The specified attribute_id does not exist.',
                data: null,
                meta: {},
            });
        } else if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error updating attribute value.',
                errors: errors,
                data: null,
                meta: {}
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating attribute value.',
            error: error.message,
            meta: {},
        });
    }
};

const deleteAttributeValue = async (req, res) => {
    try {
        const { id } = req.params;

        const affectedRowsCount = await AttributeValue.destroy({
            where: { attribute_values_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Attribute value not found.',
                data: null,
                meta: {},
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting attribute value.',
            error: error.message,
            meta: {},
        });
    }
};

module.exports = {
    createAttributeValue,
    getAllAttributeValues,
    getAttributeValueById,
    updateAttributeValue,
    deleteAttributeValue,
};