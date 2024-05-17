export class CreateTaskDto {
  constructor(
    public readonly name: string,
    public readonly description: string
  ){}

  static create (object: { [key: string]: any }): [Object?, CreateTaskDto?] {
    const { name, description } = object
    const errors: {[key: string]: any} = {}

    if (!name) errors.name = 'El nombre es obligatorio'
    if (!description) errors.description = 'La descripción es obligatoria'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new CreateTaskDto(name, description)]
  }
}