import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID, scryptSync } from 'node:crypto'
import { db } from '../database'
import { env } from '../env'
import { UserAlreadyExists, UserNotFound } from '../exception'
import { checkSessionId } from '../middleware/check-session-id'
import { userSchema } from '../schema'

export const usersRoutes = (app: FastifyInstance) => {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = randomUUID()
    const { name, email, password } = userSchema.create.parse(request.body)

    const userAlreadyExists = await db('users')
      .select('*')
      .where('email', email)
      .first()

    if (userAlreadyExists) {
      throw new UserAlreadyExists()
    }

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    await db('users').insert({
      id,
      name,
      email,
      password: scryptSync(password, env.PASSWORD_SALT, 64).toString('hex'),
      session_id: sessionId
    })

    return reply.status(201).send({
      id
    })
  })

  app.get(
    '/:id',
    { preHandler: [checkSessionId] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = userSchema.getById.parse(request.params)

      const user = await db('users')
        .select('id', 'name', 'email')
        .where('id', id)
        .first()

      if (!user) {
        throw UserNotFound.fromId(id)
      }

      return reply.status(200).send(user)
    }
  )
}
