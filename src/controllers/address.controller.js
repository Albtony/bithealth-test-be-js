const db = require('../models');
const Address = db.Address;

const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll();
        res.status(200).json({
            status: 'success',
            message: 'Addresses fetched successfully.',
            data: addresses,
            meta: { totalRecords: addresses.length },
        });
    } catch (error) {
        console.error('[AddressController]: Error fetching addresses:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching addresses',
            error: error.message,
        });
    }
};

const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findByPk(id);

        if (!address) {
            return res.status(404).json({
                status: 'fail',
                message: 'Address not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Address fetched successfully.',
            data: address,
            meta: {},
        });
    } catch (error) {
        console.error('[AddressController]: Error fetching address by ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching address',
            error: error.message,
        });
    }
};

const createAddress = async (req, res) => {
    try {
        const customer_id = req.user.id; 
        console.log('Customer ID from JWT (req.user.id):', customer_id); // <-- Add this
        console.log('Expected true Customer ID:', '70c6e13f-4a8c-40ae-97f2-b2662f405b73'); // <-- Add this for comparison

        const {
            address_line_1,
            address_line_2,
            city,
            state_province,
            postal_code,
            country,
        } = req.body;

        if (!address_line_1 || !city || !state_province || !postal_code || !country || !customer_id) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required address fields (address_line_1, city, state_province, postal_code, country, customer_id).',
                data: null,
                meta: {},
            });
        }

        const newAddress = await Address.create({
            address_line_1,
            address_line_2,
            city,
            state_province,
            postal_code,
            country,
            customer_id,
        });

        res.status(201).json({
            status: 'success',
            message: 'Address created successfully.',
            data: newAddress,
            meta: {},
        });
    } catch (error) {
        console.error('[AddressController]: Error creating address:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating address',
            error: error.message,
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const customer_id = req.user.id;

        const {
            address_line_1,
            address_line_2,
            city,
            state_province,
            postal_code,
            country,
        } = req.body;

        const updateFields = {};
        if (address_line_1 !== undefined) updateFields.address_line_1 = address_line_1;
        if (address_line_2 !== undefined) updateFields.address_line_2 = address_line_2;
        if (city !== undefined) updateFields.city = city;
        if (state_province !== undefined) updateFields.state_province = state_province;
        if (postal_code !== undefined) updateFields.postal_code = postal_code;
        if (country !== undefined) updateFields.country = country;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'No valid fields provided for update.',
                data: null,
                meta: {},
            });
        }

        const [affectedRowsCount] = await Address.update(updateFields, {
            where: {
                address_id: id,
                customer_id: customer_id
            },
        });

        if (affectedRowsCount === 0) {
            const addressExists = await Address.findOne({
                where: {
                    address_id: id,
                    customer_id: customer_id
                }
            });

            if (!addressExists) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Address not found or does not belong to the authenticated user.',
                    data: null,
                    meta: {},
                });
            } else {
                return res.status(200).json({
                    status: 'success',
                    message: 'No changes were made to the address (data provided was identical).',
                    data: addressExists,
                    meta: {},
                });
            }
        }

        const updatedAddress = await Address.findByPk(id);
        res.status(200).json({
            status: 'success',
            message: 'Address updated successfully.',
            data: updatedAddress,
            meta: {},
        });
    } catch (error) {
        console.error('[AddressController]: Error updating address:', error);
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation error during address update.',
                errors: errors,
                data: null,
                meta: {}
            });
        } else if (error.name === 'SequelizeDatabaseError') {
            return res.status(400).json({
                status: 'fail',
                message: 'Database error during address update. Check input data.',
                error: error.message,
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Error updating address',
            error: error.message,
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Address.destroy({
            where: { address_id: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Address not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Address deleted successfully.',
            data: null,
            meta: {},
        });
    } catch (error) {
        console.error('[AddressController]: Error deleting address:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting address',
            error: error.message,
        });
    }
};

module.exports = {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};