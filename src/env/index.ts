import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  PASSWORD_SALT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  PGADMIN_EMAIL: z.string().email(),
  PGADMIN_PASSWORD: z.string()
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error('Erro nas variáveis de ambiente: ' + _env.error.message)
}

export const env = _env.data
