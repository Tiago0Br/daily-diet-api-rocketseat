import { Knex, knex } from 'knex'

export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'senha123',
    database: 'daily_diet'
  },
  migrations: {
    extension: 'ts',
    directory: './database/migrations'
  }
}

export const db = knex(knexConfig)
