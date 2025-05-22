const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const SaleOrderItem = sequelize.define('SaleOrderItem', {
        order_item_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'sale_orders',
                key: 'order_id',
            },
        },
        variant_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'variant_id',
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        tableName: 'sale_order_items',
        timestamps: true,
        underscored: true,
    });

    SaleOrderItem.associate = (models) => {
        SaleOrderItem.belongsTo(models.SaleOrder, {
            foreignKey: 'order_id',
            as: 'order',
        });
        SaleOrderItem.belongsTo(models.ProductVariant, {
            foreignKey: 'variant_id',
            as: 'variant',
        });
    };

    return SaleOrderItem;
};