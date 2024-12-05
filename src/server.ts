import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { usersRoutes, mealsRoutes } from './routes'
import { errorHandler } from './middleware'

const app = fastify()

app.register(cookie)
app.setErrorHandler(errorHandler)
app.register(usersRoutes, {
  prefix: '/users'
})
app.register(mealsRoutes, {
  prefix: '/meals'
})

app
  .listen({
    port: env.PORT
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${env.PORT}`)
  })
