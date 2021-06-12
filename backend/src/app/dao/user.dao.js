const knex = require('../database/knexfile').knex;

module.exports = {
    getUserByUsername,
    getAll,
    getById,
    createUser,
    updateUser,
};

async function getById(id)
{
    return await knex.select('*').from('users').where({
        'id': id,
        'deleted_by': null,
        'deleted_at': null,
    }).limit(1);
}

async function getUserByUsername(username)
{
    return await knex.select('*').from('users').where('username', username).limit(1);
}

async function getAll(search = [])
{
    const query = knex.select('*').from('users').where({
        deleted_at: null,
        deleted_by: null,
    });

    Object.keys(search).forEach(field => {
        query.where(field, search[field].condition, search[field].value);
    });
    return await query;
}

async function createUser(data)
{
    return await knex.insert(data).into('users').returning('id');
}

async function updateUser(data, where)
{
    return await knex.update(data).into('users').where(where);
}
