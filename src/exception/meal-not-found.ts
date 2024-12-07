import { NotFoundException } from './not-found'

export class MealNotFound extends NotFoundException {
  static fromId(id: string) {
    return new this(`Refeição com id '${id}' não encontrada`)
  }
}
