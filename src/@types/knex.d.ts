import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      session_id?: string
    }
    meals: {
      id: string
      name: string
      description: string
      datetime: Date
      is_part_of_diet: boolean
      user_id: string
    }
  }
}
