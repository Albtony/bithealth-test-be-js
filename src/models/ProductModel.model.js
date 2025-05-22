const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const ProductModel = sequelize.define('ProductModel', {
        model_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'category_id',
            },
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        base_image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        base_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        tableName: 'product_models',
        timestamps: true,
        underscored: true,
    });

    ProductModel.associate = (models) => {
        ProductModel.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'category',
        });
        ProductModel.hasMany(models.ProductVariant, { foreignKey: 'model_id', as: 'variants' });
        ProductModel.belongsToMany(models.Attribute, {
            through: models.ModelAttribute,
            foreignKey: 'model_id',
            otherKey: 'attribute_id',
            as: 'attributes'
        });
    };

    return ProductModel;
};