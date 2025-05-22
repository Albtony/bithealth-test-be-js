const { DataTypes } = require('sequelize');
const recalculateOrderTotals = require('../utils/saleOrderRecalculator');

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
            validate: {
                min: 1, 
            },
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0, 
            }
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00, 
            validate: {
                min: 0, 
            }
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'RETURNED', 'BACKORDERED'), 
            defaultValue: 'PENDING',
            allowNull: false,
        },
    }, {
        tableName: 'sale_order_items', 
        timestamps: true, 
        underscored: true, 
        hooks: {
            beforeValidate: (item, options) => {
                const parsedQuantity = parseFloat(item.quantity);
                const parsedUnitPrice = parseFloat(item.unit_price);

                if (!isNaN(parsedQuantity) && !isNaN(parsedUnitPrice)) {
                    if (item.subtotal === undefined || item.changed('quantity') || item.changed('unit_price')) {
                        item.subtotal = (parsedQuantity * parsedUnitPrice).toFixed(2);
                    }
                } else {
                    console.warn("Warning: Invalid quantity or unit_price for SaleOrderItem subtotal calculation.");
                }
            },

            afterCreate: async (item, options) => {
                await recalculateOrderTotals(item.order_id, options.transaction);
            },
            afterUpdate: async (item, options) => {
                if (item.changed('quantity') || item.changed('unit_price') || item.changed('subtotal') || item.changed('order_id') || item.changed('status')) {
                    if (item.changed('order_id') && item._previousDataValues.order_id) {
                        await recalculateOrderTotals(item._previousDataValues.order_id, options.transaction);
                    }
                    await recalculateOrderTotals(item.order_id, options.transaction);
                }
            },
            afterDestroy: async (item, options) => {
                await recalculateOrderTotals(item.order_id, options.transaction);
            },
        },
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