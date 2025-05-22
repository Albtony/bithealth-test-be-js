const db = require('../models');
const Role = db.Role;

const VALID_ROLE_NAMES = Role.rawAttributes.role_name.values;
function isValidRoleName(roleName) {
    return VALID_ROLE_NAMES.includes(roleName);
}

const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({
            status: 'success',
            message: 'Roles fetched successfully.',
            data: roles,
            meta: { totalRecords: roles.length },
        });
    } catch (error) {
        console.error('[RoleController]: Error fetching roles:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching roles',
            error: error.message,
        });
    }
};

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({
                status: 'fail',
                message: 'Role not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Role fetched successfully.',
            data: role,
            meta: {},
        });
    } catch (error) {
        console.error('[RoleController]: Error fetching role by ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching role',
            error: error.message,
        });
    }
};

const createRole = async (req, res) => {
    const { role_name } = req.body;

    if (!role_name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing required field: role_name.',
        });
    }

    if (!isValidRoleName(role_name)) {
        return res.status(400).json({
            status: 'fail',
            message: `Invalid role name. Must be one of: ${VALID_ROLE_NAMES.join(', ')}`,
        });
    }

    try {
        const newRole = await Role.create({ role_name });
        return res.status(201).json({
            status: 'success',
            message: 'Role created successfully.',
            data: newRole,
        });
    } catch (error) {
        console.error('[RoleController]: Error creating role:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Role name already exists.',
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error while creating role.',
        });
    }
};

const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role_name } = req.body;

    if (!role_name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing required field: role_name.',
        });
    }

    if (!isValidRoleName(role_name)) {
        return res.status(400).json({
            status: 'fail',
            message: `Invalid role name. Must be one of: ${VALID_ROLE_NAMES.join(', ')}`,
        });
    }

    try {
        const [updatedCount] = await Role.update({ role_name }, { where: { role_id: id } });

        if (updatedCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Role not found or no changes made.',
            });
        }

        const updatedRole = await Role.findByPk(id);

        return res.status(200).json({
            status: 'success',
            message: 'Role updated successfully.',
            data: updatedRole,
        });
    } catch (error) {
        console.error('[RoleController]: Error updating role:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Role name already exists.',
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error while updating role.',
        });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Role.destroy({
            where: { role_id: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Role not found.',
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Role deleted successfully.',
            data: null,
            meta: {},
        });
    } catch (error) {
        console.error('[RoleController]: Error deleting role:', error);
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Cannot delete role as it is associated with existing customers or employees. Please reassign them before deleting this role.',
                error: error.message,
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error deleting role',
            error: error.message,
        });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};