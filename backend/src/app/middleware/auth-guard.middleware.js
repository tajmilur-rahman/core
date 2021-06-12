const jwt = require('express-jwt');
const { secret } = require('../../environments/environment');
const userService = require('../service/user.service');

module.exports = {
    canActivate
};

function canActivate() {
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            const user = await userService.getById(req.user.id);
            if (!user) {
                // user no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}