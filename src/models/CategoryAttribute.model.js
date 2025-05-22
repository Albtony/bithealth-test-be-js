const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize The Sequelize instance.
 * @param {import('sequelize').DataTypes} DataTypes The Sequelize DataTypes object.
 * @returns {import('sequelize').Model} The defined Sequelize model.
 */
module.exports = (sequelize, DataTypes) => {
    const CategoryAttribute = sequelize.define('CategoryAttribute', {
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'category_id',
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
        tableName: 'category_attributes',
        timestamps: false,
        underscored: true,
    });

    CategoryAttribute.associate = (models) => {
        CategoryAttribute.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        });
        CategoryAttribute.belongsTo(models.Attribute, {
            foreignKey: 'attribute_id',
            as: 'attribute',
        });
    };

    return CategoryAttribute;
};