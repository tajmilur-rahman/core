const knex = require('../database/knexfile').knex;

module.exports = {
    createCustomer,
};

async function createCustomer(data) {
    return await knex.insert(data).into('customers').returning('id');
}