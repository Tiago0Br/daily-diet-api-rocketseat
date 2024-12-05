import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { db } from '../database'

export async function checkSessionId(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const checkSessionIdParamsSchema = z.object({
    sessionId: z
      .string({
        required_error: "O 'sessionId' é obrigatorio",
        invalid_type_error: "O 'sessionId' deve ser uma string"
      })
      .uuid("O 'sessionId' deve ser um uuid")
  })

  const { sessionId } = checkSessionIdParamsSchema.parse(request.cookies)

  const user = await db('users')
    .select('*')
    .where('session_id', sessionId)
    .first()

  if (!user) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
