import { genSaltSync, hashSync, compareSync } from 'bcryptjs'

export class BcryptAdapter {
  static hash(password: string) {
    const salt = genSaltSync(10)
    return hashSync(password, salt)
  }

  static compare(password: string, hashed: string): boolean {
    return compareSync(password, hashed)
  }
}