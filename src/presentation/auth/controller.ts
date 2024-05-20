import { Request, Response } from "express"
import { CustomError } from "../../domain/errors"
import { ConfirmAccountDto, CreateAccountDto } from "../../domain/dto"
import { AuthService } from "../services"

export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  private handleError (error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error'})
  }

  public createAccount = (req: Request, res: Response) => {
    const [errors, createAccountDto] = CreateAccountDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.createAccount(createAccountDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public confirmAccount = (req: Request, res: Response) => {
    const [errors, confirmAccountDto] = ConfirmAccountDto.create(req.body)
    if (errors) return res.status(400).json({ errors })
    
    this.authService.confirmAccount(confirmAccountDto?.token!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }
}