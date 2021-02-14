const knex = require('../database/knexfile').knex;

module.exports = {
    getUserByUsername,
    getAllUsers,
    getUserById,
};

async function getUserById(id)
{
    return await knex.select('*').from('users').where('id', id).limit(1);
}

async function getUserByUsername(username)
{
    return await knex.select('*').from('users').where('username', username).limit(1);
}

async function getAllUsers()
{
    return await knex.select('*').from('users');
}