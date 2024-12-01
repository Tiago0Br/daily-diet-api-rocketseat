import fastify from 'fastify'
import { env } from './env'
import { usersRoutes } from './routes/users'
import { errorHandler } from './middleware'

const app = fastify()

app.setErrorHandler(errorHandler)
app.register(usersRoutes, {
  prefix: '/users'
})

app
  .listen({
    port: env.PORT
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`)
  })
