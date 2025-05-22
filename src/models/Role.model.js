const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        role_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        role_name: {
            type: DataTypes.ENUM('SUPERADMIN', 'ADMIN', 'STAFF', 'CUSTOMER'),
            allowNull: false,
            unique: true
        },
    }, {
        tableName: 'roles',
        timestamps: true,
        underscored: true,
    });

    Role.associate = (models) => {
        Role.hasMany(models.Employee, { foreignKey: 'role_id', as: 'employees' });
        Role.hasMany(models.Customer, { foreignKey: 'role_id', as: 'customers' });
    };

    return Role;
};