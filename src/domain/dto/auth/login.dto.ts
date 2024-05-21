export class LoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ){}

  static create(object: {[key: string]: any}): [Object?, LoginDto?] {
    const { email, password } = object
    const errors: {[key: string]: any} = {}
    
    if (!email) errors.email = 'El email es obligatorio'
    if (!password) errors.password = 'El password es obligatorio'

    if (Object.values(errors).length) return [errors, undefined]
    return [undefined, new LoginDto(email, password)]
  }
}