import { randomUUID, UUID } from 'crypto'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { checkSessionId } from '../middleware/check-session-id'
import { db } from '../database'
import { User } from '../@types'
import { MealNotFound } from '../exception'

export const mealsRoutes = (app: FastifyInstance) => {
  app.addHook('preHandler', checkSessionId)

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createMealSchema = z.object({
      name: z.string({
        required_error: "O campo 'name' é obrigatorio",
        invalid_type_error: "O campo 'name' deve ser uma string"
      }),
      description: z.string({
        required_error: "O campo 'description' é obrigatorio",
        invalid_type_error: "O campo 'description' deve ser uma string"
      }),
      datetime: z
        .string({
          invalid_type_error: "O campo 'datetime' deve ser uma string"
        })
        .datetime({ message: "O campo 'datetime' deve ser uma data e hora" })
        .optional(),
      is_part_of_diet: z
        .boolean({
          invalid_type_error: "O campo 'is_part_of_diet' deve ser um booleano"
        })
        .optional()
    })

    const body = createMealSchema.parse(request.body)
    const sessionId = request.cookies.sessionId as UUID
    const id = randomUUID()

    const user = (await db('users')
      .select('*')
      .where('session_id', sessionId)
      .first()) as User

    await db('meals').insert({
      id,
      name: body.name,
      description: body.description,
      datetime: body.datetime ? new Date(body.datetime) : new Date(),
      is_part_of_diet: body.is_part_of_diet ?? true,
      user_id: user.id
    })

    return reply.status(201).send({
      id
    })
  })

  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const getMealSchema = z.object({
      id: z
        .string({
          required_error: "O campo 'id' é obrigatorio",
          invalid_type_error: "O campo 'id' deve ser uma string"
        })
        .uuid("O campo 'id' deve ser um uuid válido")
    })

    const body = getMealSchema.parse(request.params)
    const sessionId = request.cookies.sessionId as UUID

    const user = (await db('users')
      .select('*')
      .where('session_id', sessionId)
      .first()) as User

    const meal = await db('meals')
      .select('*')
      .where('id', body.id)
      .where('user_id', user.id)
      .first()

    if (!meal) {
      throw MealNotFound.fromId(body.id)
    }

    return reply.status(200).send({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      datetime: meal.datetime,
      is_part_of_diet: meal.is_part_of_diet
    })
  })

  app.put('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const updateMealSchema = z.object({
      id: z
        .string({
          required_error: "O campo 'id' é obrigatorio",
          invalid_type_error: "O campo 'id' deve ser uma string"
        })
        .uuid("O campo 'id' deve ser um uuid válido"),
      name: z
        .string({
          required_error: "O campo 'name' é obrigatorio",
          invalid_type_error: "O campo 'name' deve ser uma string"
        })
        .optional(),
      description: z
        .string({
          required_error: "O campo 'description' é obrigatorio",
          invalid_type_error: "O campo 'description' deve ser uma string"
        })
        .optional(),
      datetime: z
        .string({
          invalid_type_error: "O campo 'datetime' deve ser uma string"
        })
        .datetime({ message: "O campo 'datetime' deve ser uma data e hora" })
        .optional(),
      is_part_of_diet: z
        .boolean({
          invalid_type_error: "O campo 'is_part_of_diet' deve ser um booleano"
        })
        .optional()
    })

    const body = updateMealSchema.parse({
      ...(request.body as object),
      ...(request.params as object)
    })

    const sessionId = request.cookies.sessionId as UUID

    const user = (await db('users')
      .select('*')
      .where('session_id', sessionId)
      .first()) as User

    const meal = await db('meals')
      .select('*')
      .where('id', body.id)
      .where('user_id', user.id)
      .first()

    if (!meal) {
      throw MealNotFound.fromId(body.id)
    }

    await db('meals')
      .update({
        name: body.name ?? meal.name,
        description: body.description ?? meal.description,
        datetime: body.datetime ? new Date(body.datetime) : meal.datetime,
        is_part_of_diet: body.is_part_of_diet ?? meal.is_part_of_diet
      })
      .where('id', body.id)
      .andWhere('user_id', user.id)

    return reply.status(204).send()
  })
}
