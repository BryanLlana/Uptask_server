import { Request, Response } from "express"
import { CustomError } from "../../domain/errors"
import { ConfirmAccountDto, CreateAccountDto, LoginDto, RequestCodeDto, UpdatePasswordDto } from "../../domain/dto"
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
    
    this.authService.confirmAccount(confirmAccountDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public requestNewCode = (req: Request, res: Response) => {
    const [errors, requestCodeDto] = RequestCodeDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.requestNewCode(requestCodeDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public forgotPassword = (req: Request, res: Response) => {
    const [errors, requestCodeDto] = RequestCodeDto.create(req.body)
    if (errors) return res.status(400).json({ errors })
    
    this.authService.forgotPassword(requestCodeDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public validateToken = (req: Request, res: Response) => {
    const [errors, confirmAccountDto] = ConfirmAccountDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.validateToken(confirmAccountDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public updatePassword = (req: Request, res: Response) => {
    const [errors, updatePasswordDto] = UpdatePasswordDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.updatePassword(req.params.token, updatePasswordDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public login = (req:Request, res: Response) => {
    const [errors, loginDto] = LoginDto.create(req.body)
    if (errors) return res.status(400).json({ errors })

    this.authService.login(loginDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public getUser = (req: Request, res: Response) => {
    res.status(200).json(req.body.user)
  }
}