const Joi = require('@hapi/joi');
const userService = require('../../service/user.service');

module.exports = {
    getUsers,
};

function getUsers(req, res, next)
{
    userService.getUsers()
        .then(response => {
            res.json(response);
        })
        .catch(next);
}