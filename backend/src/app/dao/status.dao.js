const knex = require('../database/knexfile').knex;

module.exports = {
    getAll,
};

async function getAll(search = [])
{
    const query = knex.select('*').from('statuses');
    Object.keys(search).forEach(field => {
        query.where(field, search[field].condition, search[field].value);
    });
    return await query;
}
