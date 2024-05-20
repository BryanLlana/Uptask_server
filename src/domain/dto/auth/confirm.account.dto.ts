export class ConfirmAccountDto {
  constructor(
    public readonly token: string
  ){}

  static create(object: {[key: string]: any}): [Object?, ConfirmAccountDto?] {
    const { token } = object
    const errors: {[key: string]: any} = {}
    
    if (!token) errors.token = 'El token es obligatorio'

    if (Object.values(errors).length) return [errors, undefined]
    return [undefined, new ConfirmAccountDto(token)]
  }
}