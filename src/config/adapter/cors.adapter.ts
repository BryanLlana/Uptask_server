import cors from 'cors'
import { envs } from '../envs';

export class CorsAdapter {
  private static readonly options = {
    origin: (origin: any, callback: any) => {
      if ([envs.FRONTEND_URL, undefined].includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Error de cors'))
      }
    }
  }

  public static create() {
    return () => cors(this.options)
  }
}