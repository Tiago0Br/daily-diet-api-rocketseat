import { DomainException } from './domain-exception'

export class UserAlreadyExists extends DomainException {
  constructor() {
    super('Já existe um usuário cadastrado com esse e-mail')
  }
}
