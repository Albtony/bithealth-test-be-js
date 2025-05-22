const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role_name;
        const userId = req.user?.customer_id;

        if (!userRole) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: No authentication token provided or user not found.',
            });
        }

        if (userRole === 'SUPERADMIN') return next();

        if (allowedRoles.includes(userRole)) return next();

        console.warn(`[AuthRole]: Forbidden access attempt by ${userRole} (ID: ${userId})`);
        return res.status(403).json({
            status: 'error',
            message: `Forbidden: Your role (${userRole}) does not have permission to access this resource.`,
        });
    };
};

module.exports = authorizeRole;
