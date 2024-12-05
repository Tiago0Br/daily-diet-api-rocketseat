import { randomUUID, UUID } from 'crypto'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { checkSessionId } from '../middleware/check-session-id'
import { db } from '../database'
import { UserNotFound } from '../exception'

export const mealsRoutes = (app: FastifyInstance) => {
  app.addHook('preHandler', checkSessionId)

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createMealBodySchema = z.object({
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

    const body = createMealBodySchema.parse(request.body)
    const sessionId = request.cookies.sessionId as UUID
    const id = randomUUID()

    const user = await db('users')
      .select('*')
      .where('session_id', sessionId)
      .first()

    if (!user) {
      throw UserNotFound.fromSessionId(sessionId)
    }

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
}
