const config = require('../../environments/environment');

module.exports = {
  knex: require('knex')({
    client: config.database.client,
    connection: {
      host : config.database.host,
      user : config.database.username,
      password : config.database.password,
      database : config.database.name
    }
  }),
  development: {
    client: config.database.client,
    connection: {
      database: config.database.name,
      user:     config.database.username,
      password: config.database.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  staging: {
    client: config.database.client,
    connection: {
      database: config.database.name,
      user:     config.database.username,
      password: config.database.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: config.database.client,
    connection: {
      database: config.database.name,
      user:     config.database.username,
      password: config.database.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
