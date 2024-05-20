import { BcryptAdapter } from "../../../config/adapter"

export class CreateAccountDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ){}

  static create(object: {[key: string]: any}): [Object?, CreateAccountDto?] {
    const {name, email, password, password2} = object
    const errors: {[key: string]: any} = {}
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!name) errors.name = 'El nombre es obligatorio'
    if (!email) errors.email = 'El email es obligatorio'
    else if (!regex.test(email)) errors.email = 'El email no es válido'
    if (!password) errors.password = 'El password es obligatorio'
    else if (password.length < 8) errors.password = 'El password debe tener mínimo 8 caracteres'
    if (!password2) errors.password2 = 'El password de confirmación es obligatorio' 
    else if (password !== password2) errors.password2 = 'Los passwords no son iguales'

    if (Object.values(errors).length > 0) return [errors, undefined]
    return [undefined, new CreateAccountDto(name, email, BcryptAdapter.hash(password))] 
  }
}