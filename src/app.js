const express = require('express');
const app = express();
const cors = require('cors');

const mainRouter = require('./routes'); 

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./config/openapi.yaml');

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/', mainRouter);
app.use('/docs-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;