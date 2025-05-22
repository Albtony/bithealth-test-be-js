require('dotenv').config();

const app = require('./app'); 
const db = require('./models'); 

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await db.sequelize.authenticate();
        console.log('[SERVER]: Database connection has been established successfully.');

        await db.sequelize.sync({ alter: true });
        console.log('[SERVER]: All models were synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`[SERVER]: Server is running on port ${PORT}`);
            console.log(`[SERVER]: Access frontend at ${process.env.CLIENT_URL}`);
            console.log(`[SERVER]: Running in ${process.env.NODE_ENV} environment.`);
        });
    } catch (error) {
        console.error('[SERVER]: Unable to connect to the database or start server:', error);
        process.exit(1); 
    }
}

process.on('SIGINT', async () => {
    console.log('[SERVER]: Closing database connection...');
    await db.sequelize.close(); 
    console.log('[SERVER]: Database connection closed.');
    process.exit(0);
});

startServer();