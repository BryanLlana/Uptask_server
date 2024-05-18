import { error } from "console"

export class UpdateTaskDto {
  constructor(
    public readonly name: string,
    public readonly description: string,
  ){}

  get values() {
    const returnObj: {[key: string]: any} = {}
    if (this.name) returnObj.name = this.name
    if (this.description) returnObj.description = this.description
    return returnObj
  }

  static create(object: {[key: string]: any}): [Object?, UpdateTaskDto?] {
    const { name, description } = object
    const errors: {[key: string]: any} = {}
    if (name?.trim() === '') errors.name = 'El nombre es obligatorio'
    if (description?.trim() === '') errors.description = 'La descripción es obligatoria'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new UpdateTaskDto(name, description)]
  }
}