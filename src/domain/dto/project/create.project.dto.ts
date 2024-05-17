export class CreateProjectDto {
  constructor(
    public readonly name: string,
    public readonly customer: string,
    public readonly description: string
  ){}

  static create (body: { [key: string]: any }): [Object?, CreateProjectDto?] {
    const { name, customer, description } = body
    const errors: {[key: string]: any} = {}
    
    if (!name) errors.name = 'El nombre es obligatorio'
    if (!customer) errors.customer = 'El cliente es obligatorio'
    if (!description) errors.description = 'La descripción es obligatoria'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new CreateProjectDto(name, customer, description)]
  }
}