const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const Attribute = sequelize.define('Attribute', {
        attribute_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'attributes',
        timestamps: true,
        underscored: true,
    });

    Attribute.associate = (models) => {
        Attribute.hasMany(models.AttributeValue, { foreignKey: 'attribute_id', as: 'values' });
        Attribute.belongsToMany(models.Category, {
            through: models.CategoryAttribute,
            foreignKey: 'attribute_id',
            otherKey: 'category_id',
            as: 'categories'
        });
        Attribute.belongsToMany(models.ProductModel, {
            through: models.ModelAttribute,
            foreignKey: 'attribute_id',
            otherKey: 'model_id',
            as: 'productModels'
        });
    };

    return Attribute;
};