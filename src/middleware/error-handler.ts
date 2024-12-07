import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { DomainException, NotFoundException } from '../exception'

export function errorHandler(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
) {
  let statusCode = 500
  let message = error.message

  if (error instanceof ZodError) {
    statusCode = 409
    message = error.issues[0].message
  }

  if (error instanceof DomainException) {
    statusCode = 409
  }

  if (error instanceof NotFoundException) {
    statusCode = 404
  }

  return reply.status(statusCode).send({ message })
}
