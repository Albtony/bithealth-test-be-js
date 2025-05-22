const dbConfig = {
    development: {
        username: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME,
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        dialect: process.env.DEV_DB_DIALECT || 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: console.log
    },
    production: {
        username: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        dialect: process.env.PROD_DB_DIALECT || 'mysql',
        pool: {
            max: 10, 
            min: 2,
            acquire: 30000,
            idle: 10000,
        },
        logging: false, 
    },
    test: {
        username: process.env.TEST_DB_USER || process.env.DEV_DB_USER,
        password: process.env.TEST_DB_PASSWORD || process.env.DEV_DB_PASSWORD,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        port: process.env.TEST_DB_PORT,
        dialect: process.env.TEST_DB_DIALECT || 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 10000, 
            idle: 5000,   
        },
        logging: console.log
    },
};

module.exports = dbConfig;