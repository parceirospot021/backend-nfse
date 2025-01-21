import knexfile from '../../knexfile.cjs'
import knex from 'knex'
const env = process.env.NODE_ENV || 'development';

export const postgresConnection = knex(knexfile[env]);