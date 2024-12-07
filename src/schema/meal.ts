import { z } from 'zod'

export const create = z.object({
  name: z.string({
    required_error: "O campo 'name' é obrigatorio",
    invalid_type_error: "O campo 'name' deve ser uma string"
  }),
  description: z.string({
    required_error: "O campo 'description' é obrigatorio",
    invalid_type_error: "O campo 'description' deve ser uma string"
  }),
  datetime: z
    .string({
      invalid_type_error: "O campo 'datetime' deve ser uma string"
    })
    .datetime({ message: "O campo 'datetime' deve ser uma data e hora" })
    .optional(),
  is_part_of_diet: z
    .boolean({
      invalid_type_error: "O campo 'is_part_of_diet' deve ser um booleano"
    })
    .optional()
})

export const getById = z.object({
  id: z
    .string({
      required_error: "O campo 'id' é obrigatorio",
      invalid_type_error: "O campo 'id' deve ser uma string"
    })
    .uuid("O campo 'id' deve ser um uuid válido")
})

export const update = z.object({
  id: z
    .string({
      required_error: "O campo 'id' é obrigatorio",
      invalid_type_error: "O campo 'id' deve ser uma string"
    })
    .uuid("O campo 'id' deve ser um uuid válido"),
  name: z
    .string({
      required_error: "O campo 'name' é obrigatorio",
      invalid_type_error: "O campo 'name' deve ser uma string"
    })
    .optional(),
  description: z
    .string({
      required_error: "O campo 'description' é obrigatorio",
      invalid_type_error: "O campo 'description' deve ser uma string"
    })
    .optional(),
  datetime: z
    .string({
      invalid_type_error: "O campo 'datetime' deve ser uma string"
    })
    .datetime({ message: "O campo 'datetime' deve ser uma data e hora" })
    .optional(),
  is_part_of_diet: z
    .boolean({
      invalid_type_error: "O campo 'is_part_of_diet' deve ser um booleano"
    })
    .optional()
})
