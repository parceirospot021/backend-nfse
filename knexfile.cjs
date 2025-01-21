// Update with your config settings.
const dotenv = require('dotenv');
dotenv.config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      // uri: process.env.DB_URL,
      connectionString: process.env.DB_URL,
    },
    searchPath: ['knex', 'public'],
    // connection: {
    //   host: process.env.DB_URL,
    //   user: '[db_username]',
    //   password: '[db_password]',
    //   database: '[db_name]',
    //   charset: 'utf8'
    // },
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds'
    }
  },

  testing: {
    client: 'pg',
    connection: process.env.DB_URL,
    searchPath: ['knex', 'public'],
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: {
      directory: './src/database/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'spot_nfse',
      user: 'username',
      password: 'password',
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
