const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('Employee', {
        employee_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hire_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'role_id',
            },
        },
    }, {
        tableName: 'employees',
        timestamps: true,
        underscored: true,
    });

    Employee.associate = (models) => {
        Employee.belongsTo(models.Role, {
            foreignKey: 'role_id',
            as: 'role',
        });
        Employee.hasMany(models.SaleOrder, {
            foreignKey: 'employee_id',
            as: 'saleOrders',
        });
    };

    return Employee;
};