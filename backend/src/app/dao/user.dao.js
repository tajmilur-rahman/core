const knex = require('../database/knexfile').knex;

module.exports = {
    getUserByUsername,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
};

async function getUserById(id)
{
    return await knex.select('*').from('users').where('id', id).limit(1);
}

async function getUserByUsername(username)
{
    return await knex.select('*').from('users').where('username', username).limit(1);
}

async function getAllUsers(search = [])
{
    const query = knex.select('*').from('users');
    search.forEach(param => {
        query.where(param.field, param.condition, param.value);
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
