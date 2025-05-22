const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const SaleOrder = sequelize.define('SaleOrder', {
        order_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'employees',
                key: 'employee_id',
            },
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: true, // Nullable for walk-in customers
            references: {
                model: 'customers',
                key: 'customer_id',
            },
        },
        order_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'), 
            allowNull: false,
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: true, // For walk-in customers
        },
        customer_email: {
            type: DataTypes.STRING,
            allowNull: true, // For walk-in customers
        },
    }, {
        tableName: 'sale_orders',
        timestamps: true,
        underscored: true,
    });

    SaleOrder.associate = (models) => {
        SaleOrder.belongsTo(models.Employee, {
            foreignKey: 'employee_id',
            as: 'employee',
        });
        SaleOrder.belongsTo(models.Customer, {
            foreignKey: 'customer_id',
            as: 'customer',
        });
        SaleOrder.hasMany(models.SaleOrderItem, {
            foreignKey: 'order_id',
            as: 'items',
        });
    };

    return SaleOrder;
};