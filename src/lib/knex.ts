import knex from 'knex'
import { connection } from '../../database/connection'

export const db = knex(connection)
