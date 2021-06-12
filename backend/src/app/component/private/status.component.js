const statusService = require('../../service/status.service');

module.exports = {
    getAll,
};

function getAll(req, res, next)
{
    const search = req.query.search;
    statusService.getAll(search)
        .then(response => {
            res.json({
                totalCount: response.length,
                result: response,
            });
        })
        .catch(next);
}
