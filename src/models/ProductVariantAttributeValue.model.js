const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const ProductVariantAttributeValue = sequelize.define('ProductVariantAttributeValue', {
        variant_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'product_variants',
                key: 'variant_id',
            },
        },
        attribute_value_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'attribute_values',
                key: 'attribute_values_id',
            },
        },
    }, {
        tableName: 'product_variant_attribute_values',
        timestamps: false,
        underscored: true,
    });

    ProductVariantAttributeValue.associate = (models) => {
        ProductVariantAttributeValue.belongsTo(models.ProductVariant, {
            foreignKey: 'variant_id',
            as: 'productVariant',
        });
        ProductVariantAttributeValue.belongsTo(models.AttributeValue, {
            foreignKey: 'attribute_value_id',
            as: 'attributeValue',
        });
    };

    return ProductVariantAttributeValue;
};