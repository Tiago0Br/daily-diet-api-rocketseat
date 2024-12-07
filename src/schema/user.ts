import { z } from 'zod'

export const create = z.object({
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

export const getById = z.object({
  id: z
    .string({
      required_error: "O campo 'id' é obrigatorio",
      invalid_type_error: "O campo 'id' deve ser uma string"
    })
    .uuid({ message: "O campo 'id' deve ser um UUID" })
})
