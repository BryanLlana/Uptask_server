export class UpdatePasswordDto {
  constructor(
    public readonly password: string,
    public readonly password2: string
  ){}

  static create(object: {[key: string]: any}): [Object?, UpdatePasswordDto?] {
    const { password, password2 } = object
    const errors: {[key: string]: any } = {}

    if (!password) errors.password = 'El password es obligatorio'
    else if (password.length < 8) errors.password = 'El password debe tener mínimo 8 caracteres'
    if (!password2) errors.password2 = 'El password de confirmación es obligatorio' 
    else if (password !== password2) errors.password2 = 'Los passwords no son iguales'

    if (Object.values(errors).length) return [errors, undefined]
    return [undefined, new UpdatePasswordDto(password, password2)]
  }
}