import { NotFoundException } from './not-found'

export class UserNotFound extends NotFoundException {
  static fromId(id: string) {
    return new this(`Usuário com id '${id}' não encontrado`)
  }
}
