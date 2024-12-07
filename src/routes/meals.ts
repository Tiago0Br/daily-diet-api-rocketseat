import { randomUUID, UUID } from 'crypto'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { checkSessionId } from '../middleware/check-session-id'
import { db } from '../database'
import { User } from '../@types'
import { MealNotFound } from '../exception'
import { mealSchema } from '../schema'

export const mealsRoutes = (app: FastifyInstance) => {
  app.addHook('preHandler', checkSessionId)

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = mealSchema.create.parse(request.body)
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

  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const sessionId = request.cookies.sessionId as UUID

    const user = (await db('users')
      .select('*')
      .where('session_id', sessionId)
      .first()) as User

    const meals = await db('meals')
      .select('id', 'name', 'description', 'datetime', 'is_part_of_diet')
      .where('user_id', user.id)

    return reply.status(200).send({
      meals: meals.map((meal) => meal)
    })
  })

  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = mealSchema.getById.parse(request.params)
    const sessionId = request.cookies.sessionId as UUID

    const user = (await db('users')
      .select('*')
      .where('session_id', sessionId)
      .first()) as User

    const meal = await db('meals')
      .select('id', 'name', 'description', 'datetime', 'is_part_of_diet')
      .where('id', id)
      .where('user_id', user.id)
      .first()

    if (!meal) {
      throw MealNotFound.fromId(id)
    }

    return reply.status(200).send(meal)
  })

  app.put('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = mealSchema.update.parse({
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

  app.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = mealSchema.getById.parse(request.params)
    const sessionId = request.cookies.sessionId as UUID

    const user = (await db('users')
      .select('*')
      .where('session_id', sessionId)
      .first()) as User

    await db('meals').delete().where('id', id).andWhere('user_id', user.id)

    return reply.status(204).send()
  })
}
