import { Knex } from 'knex'

export const connection: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'senha123',
    database: 'daily_diet'
  }
}
