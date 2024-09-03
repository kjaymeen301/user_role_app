const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authMiddleware = async (req, res, next) => {
    const accessToken = req.headers['access_token'];

    if (!accessToken) {
        return res.status(403).json({ error: 'Access token is required' });
    }

    try {
        const decoded = jwt.verify(accessToken, 'secret');

        const user = await User.findById(decoded.id).populate('role');

        if (!user) {
            return res.status(403).json({ error: 'User not found' });
        }

        req.user = user;
        req.user.id = user.id;

        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Invalid token' });
        }
        return res.status(500).json({ error: 'Server error' });
    }
};

const checkPermission = (requiredModule, requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId).populate('role');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const role = user.role;
            if (!role) {
                return res.status(403).json({ error: 'User role not found' });
            }

            if (role.roleName === "superadmin") {
                next();
            } else {
                const accessModules = role.accessModules || [];
                const module = accessModules.find(mod => mod.name === requiredModule);

                if (!module) {
                    return res.status(403).json({ error: 'Access to module denied1' });
                }

                const hasPermission = module.permission[requiredPermission] === 1;

                if (!hasPermission) {
                    return res.status(403).json({ error: 'Insufficient permissions' });
                }

                next();
            }
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = {
    authMiddleware,
    checkPermission
}