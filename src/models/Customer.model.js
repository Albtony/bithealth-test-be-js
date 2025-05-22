const { DataTypes } = require('sequelize'); 

module.exports = (sequelize, DataTypes) => { 
    const Customer = sequelize.define('Customer', {
        customer_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        loyalty_points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, 
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { 
                model: 'roles',
                key: 'role_id',
            },
        },
    }, {
        tableName: 'customers',
        timestamps: true, 
        underscored: true, 
    });

    Customer.associate = (models) => {
        Customer.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
        Customer.hasMany(models.Address, { foreignKey: 'customer_id', as: 'addresses' });
        Customer.hasMany(models.SaleOrder, { foreignKey: 'customer_id', as: 'saleOrders' });
    };

    return Customer; 
};