import jwt from 'jsonwebtoken'
import { envs } from '../envs'

export class JwtAdapter {
  static generateToken (payload: any, duration: string = '5h'): Promise<string | null> {
    return new Promise(resolve => {
      jwt.sign(payload, envs.JWT_SECRET_KEY, { expiresIn: duration }, (error, token) => {
        if (error) return resolve(null)
        resolve(token!)
      })
    })
  }

  static validateToken<T>(token: string): Promise<T | null> {
    return new Promise(resolve => {
      jwt.verify(token, envs.JWT_SECRET_KEY, (error, decoded) => {
        if (error) return resolve(null)
        resolve(decoded as T)
      })
    })
  }
}