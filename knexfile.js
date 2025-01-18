// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DB_URL,
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
  }
};
