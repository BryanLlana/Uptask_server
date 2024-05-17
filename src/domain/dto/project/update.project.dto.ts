export class UpdateProjectDto {
  constructor (
    public readonly name: string,
    public readonly customer: string,
    public readonly description: string
  ){}

  get values () {
    const returnObj: { [ key: string]: any } = {}
    if (this.name) returnObj.name = this.name
    if (this.customer) returnObj.customer = this.customer
    if (this.description) returnObj.description = this.description

    return returnObj
  }

  static create (body: { [key: string]: any }): [Object?, UpdateProjectDto?] {
    const { name, customer, description } = body
    const errors: {[key: string]: any} = {}
    
    if (name !== undefined && name === '') errors.name = 'El nombre es obligatorio'
    if (customer !== undefined && customer === '') errors.customer = 'El cliente es obligatorio'
    if (description !== undefined && description === '') errors.description = 'La descripción es obligatoria'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new UpdateProjectDto(name, customer, description)]
  }
}