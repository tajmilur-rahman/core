const config = require('../../environments/environment');

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : config.database.host,
      user : config.database.username,
      password : config.database.password,
      database : config.database.name
    }
});

module.exports = knex;
