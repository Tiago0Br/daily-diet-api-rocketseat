import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '../database'

export const usersRoutes = (app: FastifyInstance) => {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
    })

    const createUserBody = createUserBodySchema.parse(request.body)
    const id = randomUUID()

    await db('users').insert({
      id,
      name: createUserBody.name,
      email: createUserBody.email,
      password: createUserBody.password
    })

    return reply.status(201).send({
      id
    })
  })
}
