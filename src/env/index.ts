import 'dotenv/config'
import zod from 'zod'

const envSchema = zod.object({
  APP_ENV: zod
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: zod.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error('Erro nas variáveis de ambiente: ' + _env.error.message)
}

export const env = _env.data
