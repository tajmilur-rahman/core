const Joi = require('@hapi/joi');
const userService = require('../../service/user.service');

module.exports = {
    getAll,
};

function getAll(req, res, next)
{
    const search = req.query.search;
    userService.getAll(search)
        .then(response => {
            res.json({
                totalCount: response.length,
                result: response,
            });
        })
        .catch(next);
}
