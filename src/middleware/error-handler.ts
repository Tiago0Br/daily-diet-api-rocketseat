import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { DomainException } from '../exception'

export function errorHandler(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(409).send({ message: error.issues[0].message })
  }

  if (error instanceof DomainException) {
    return reply.status(409).send({ message: error.message })
  }

  return reply.status(500).send({ message: 'Internal server error' })
}
