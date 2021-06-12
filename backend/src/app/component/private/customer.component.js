const Joi = require('@hapi/joi');
const customerService = require('../../service/customer.service');

module.exports = {
    getAll,
};

function getAll(req, res, next)
{
    const search = req.query.search;
    customerService.getAll(search)
        .then(response => {
            res.json({
                totalCount: response.length,
                result: response,
            });
        })
        .catch(next);
}
