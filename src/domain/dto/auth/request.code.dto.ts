export class RequestCodeDto {
  constructor(
    public readonly email: string
  ){}

  static create(object: {[key:string]: any}): [Object?, RequestCodeDto?] {
    const { email } = object
    const errors: {[key: string]: any} = {}
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!email) errors.email = 'El email es obligatorio'
    else if (!regex.test(email)) errors.email = 'El email no es válido'

    if (Object.values(errors).length) return [errors, undefined]
    return [undefined, new RequestCodeDto(email)]
  }
}