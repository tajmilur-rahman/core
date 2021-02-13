const db = require('../helper/db');

module.exports = {
    getUserByUsername,
    getAllUsers,
    getUserById,
};

async function getUserById(id)
{
    return await db.select('*').from('users').where('id', id).limit(1);
}

async function getUserByUsername(username)
{
    return await db.select('*').from('users').where('username', username).limit(1);
}

async function getAllUsers()
{
    return await db.select('*').from('users');
}