require('dotenv').config();
const { verifyToken } = require('../config/jwt.config');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ 
            status: 'error', 
            message: 'No authentication token provided.', 
            data: null 
        });
    }

    try {
        const decodedPayload = verifyToken(token);
        req.user = { 
            id: decodedPayload.id, 
            type: decodedPayload.type, 
            role_name: decodedPayload.role_name,
        };
        
        next();
    } catch (err) {
        console.error('[AuthToken]: JWT verification error:', err.message);
        return res.status(403).json({ 
            status: 'error', 
            message: 'Invalid or expired token.', 
            data: null 
        });
    }
};

module.exports = authenticateToken;
