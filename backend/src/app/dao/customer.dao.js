const knex = require('../database/knexfile').knex;

module.exports = {
    createCustomer,
    getAll,
};

async function createCustomer(data) {
    return await knex.insert(data).into('customers').returning('id');
}

async function getAll(search = [])
{
    const query = knex.select('*').from('customers');
    Object.keys(search).forEach(field => {
        query.where(field, search[field].condition, search[field].value);
    });
    return await query;
}
