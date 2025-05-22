const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const ProductVariant = sequelize.define('ProductVariant', {
        variant_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        model_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'product_models',
                key: 'model_id',
            },
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        variant_image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'product_variants',
        timestamps: true,
        underscored: true,
    });

    ProductVariant.associate = (models) => {
        ProductVariant.belongsTo(models.ProductModel, {
            foreignKey: 'model_id',
            as: 'productModel',
        });
        ProductVariant.hasMany(models.ProductVariantAttributeValue, {
            foreignKey: 'variant_id',
            as: 'variantAttributeValues',
        });
        ProductVariant.hasMany(models.SaleOrderItem, {
            foreignKey: 'variant_id',
            as: 'saleOrderItems',
        });
    };

    return ProductVariant;
};