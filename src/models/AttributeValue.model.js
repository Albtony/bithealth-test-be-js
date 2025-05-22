const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const AttributeValue = sequelize.define('AttributeValue', {
        attribute_values_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        attribute_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'attributes',
                key: 'attribute_id',
            },
            unique: 'compositeUniqueAttributeValue', 
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeUniqueAttributeValue',
        },
        price_modifier: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        tableName: 'attribute_values',
        timestamps: true,
        underscored: true,
    });

    AttributeValue.associate = (models) => {
        AttributeValue.belongsTo(models.Attribute, {
            foreignKey: 'attribute_id',
            as: 'attribute',
        });
        AttributeValue.hasMany(models.ProductVariantAttributeValue, { foreignKey: 'attribute_value_id', as: 'productVariantAttributeValues' });
    };

    return AttributeValue;
};