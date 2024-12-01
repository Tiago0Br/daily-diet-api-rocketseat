import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID, scryptSync } from 'node:crypto'
import { z } from 'zod'
import { db } from '../database'
import { UserAlreadyExists } from '../exception'

export const usersRoutes = (app: FastifyInstance) => {
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserBodySchema = z.object({
      name: z.string({
        required_error: "O campo 'name' é obrigatorio",
        invalid_type_error: "O campo 'name' deve ser uma string"
      }),
      email: z
        .string({ required_error: "O campo 'email' é obrigatorio" })
        .email({ message: "O 'email' deve ser um email valido" }),
      password: z.string({
        required_error: "O campo 'password' é obrigatorio",
        invalid_type_error: "O campo 'password' deve ser uma string"
      })
    })

    const id = randomUUID()
    const { name, email, password } = createUserBodySchema.parse(request.body)

    const userAlreadyExists = await db('users')
      .select('*')
      .where('email', email)
      .first()

    if (userAlreadyExists) {
      throw new UserAlreadyExists()
    }

    await db('users').insert({
      id,
      name,
      email,
      password: scryptSync(password, 'salt', 64).toString('hex')
    })

    return reply.status(201).send({
      id
    })
  })
}
