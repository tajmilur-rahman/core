const Joi = require('@hapi/joi');
const validateRequest = require('../../middleware/validate-request');
const userService = require('../../service/user.service');

module.exports = {
    authenticateSchema,
    authenticate
};

function authenticateSchema(req, res, next)
{
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next)
{
    const { username, password } = req.body;
    const ipAddress = req.ip;
    userService.authenticate({ username, password, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}

function setTokenCookie(res, token)
{
    // create http only cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}