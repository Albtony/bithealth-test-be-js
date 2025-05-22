const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        category_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        category_name: {
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true,          
        },
    }, {
        tableName: 'categories',
        timestamps: true,
        underscored: true,
    });

    Category.associate = (models) => {
        Category.hasMany(models.ProductModel, { foreignKey: 'category_id', as: 'productModels' });
        Category.belongsToMany(models.Attribute, {
            through: models.CategoryAttribute,
            foreignKey: 'category_id',
            otherKey: 'attribute_id',
            as: 'attributes'
        });
    };

    return Category;
};