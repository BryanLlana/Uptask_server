import express, { Router } from 'express'
import colors from 'colors'
import morgan from 'morgan'

type Props = {
  port: number,
  routes: Router,
  cors: Function
}

export class Server {
  private readonly app = express()
  private readonly port: number
  private readonly routes: Router
  private readonly cors: Function
  private serverListener: any

  constructor(config: Props) {
    this.port = config.port
    this.routes = config.routes
    this.cors = config.cors
  }

  public start() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    this.app.use(morgan('dev'))

    this.app.use(this.cors())

    this.app.use(this.routes)

    this.serverListener = this.app.listen(this.port, () => {
      console.log(colors.cyan.bold(`Server running on port ${this.port}`))
    })
  }

  public close() {
    this.serverListener.close()
  }
}