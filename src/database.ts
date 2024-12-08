import { Knex, knex } from 'knex'
import { env } from './env'

export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  },
  migrations: {
    extension: 'ts',
    directory: './database/migrations'
  }
}

export const db = knex(knexConfig)
