const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const ModelAttribute = sequelize.define('ModelAttribute', {
        model_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'product_models',
                key: 'model_id',
            },
        },
        attribute_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'attributes',
                key: 'attribute_id',
            },
        },
    }, {
        tableName: 'model_attributes',
        timestamps: false,
        underscored: true,
    });

    ModelAttribute.associate = (models) => {
        ModelAttribute.belongsTo(models.ProductModel, {
            foreignKey: 'model_id',
            as: 'productModel',
        });
        ModelAttribute.belongsTo(models.Attribute, {
            foreignKey: 'attribute_id',
            as: 'attribute',
        });
    };

    return ModelAttribute;
};