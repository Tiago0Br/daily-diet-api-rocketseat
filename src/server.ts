import fastify from 'fastify'
import { env } from './types/env'

const app = fastify()

app.get('/hello', () => {
  return { hello: 'world' }
})

app
  .listen({
    port: env.PORT
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`)
  })
