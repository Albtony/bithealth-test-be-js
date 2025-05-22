const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db');
const path = require('path');
const fs = require('fs');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; 
const config = dbConfig[env]; 

const db = {};
let sequelize;

if (!config) {
    throw new Error(`[DB]: database configuration not found for environment: ${env}`);
}

sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: config.pool,
    logging: config.logging, 
});

fs
    .readdirSync(__dirname) 
    .filter(file => {
        return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1 
        );
    })
    .forEach(file => {
        console.log('Attempting to load model file:', file); // <--- ADD THIS LINE
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.name] = model; 
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db); 
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 