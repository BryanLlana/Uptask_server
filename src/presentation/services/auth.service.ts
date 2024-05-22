import { envs } from "../../config";
import { BcryptAdapter, JwtAdapter } from "../../config/adapter";
import Token, { IToken } from "../../data/mongo/models/token.model";
import User, { IUser } from '../../data/mongo/models/user.model';
import { ConfirmAccountDto, CreateAccountDto, LoginDto, RequestCodeDto, UpdatePasswordDto } from "../../domain/dto";
import { CustomError } from "../../domain/errors";
import { generateSixDigit } from "../../utils";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService
  ) { }

  public async createAccount(createAccountDto: CreateAccountDto) {
    const userExists = await User.findOne({ email: createAccountDto.email })
    if (userExists) throw CustomError.badRequest('Email ya registrado')

    const user = new User(createAccountDto) as IUser

    //* Generar token
    const token = new Token()
    token.token = generateSixDigit()
    token.user = user._id

    try {
      await this.sendEmailValidationLink(user, token)
      await Promise.allSettled([user.save(), token.save()])
      return {
        message: 'Cuenta registrada, revisa tu email para confirmarla'
      }
    } catch (error) {
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async confirmAccount(confirmAccountDto: ConfirmAccountDto) {
    const tokenExists = await Token.findOne({ token: confirmAccountDto.token })
    if (!tokenExists) throw CustomError.badRequest('Token no válido')
    const user = await User.findById(tokenExists.user)
    try {
      user!.active = true
      await Promise.allSettled([user?.save(), tokenExists.deleteOne()])
      return {
        message: 'Cuenta confirmada correctamente'
      }
    } catch (error) {
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async requestNewCode(requestCodeDto: RequestCodeDto) {
    const user = await User.findOne({ email: requestCodeDto.email }) as IUser
    if (!user) throw CustomError.notFound('Email no registrado')
    if (user.active) throw CustomError.badRequest('Este email ya está confirmado')

    const token = new Token()
    token.token = generateSixDigit()
    token.user = user._id

    try {
      await this.sendEmailValidationLink(user, token)
      await token.save()
      return {
        message: 'Hemos enviado un nuevo código a tu email'
      }
    } catch (error) {
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async forgotPassword(requestCodeDto: RequestCodeDto) {
    const user = await User.findOne({ email: requestCodeDto.email }) as IUser
    if (!user) throw CustomError.notFound('Email no registrado')

    const token = new Token() as IToken
    token.token = generateSixDigit()
    token.user = user._id

    try {
      await this.sendEmailForgotPassword(user, token)
      await token.save()
      return {
        message: 'Revisa tu email para ver las instrucciones'
      }
    } catch (error) {
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async validateToken (confirmAccountDto: ConfirmAccountDto) {
    const tokenExists = await Token.findOne({ token: confirmAccountDto.token })
    if (!tokenExists) throw CustomError.badRequest('Token no válido')
    return {
      message: 'Token validado correctamente'
    }
  }

  public async updatePassword (token: string, updatePassswordDto: UpdatePasswordDto) {
    const tokenExists = await Token.findOne({ token })
    if (!tokenExists) throw CustomError.badRequest('Token no válido')
    const user = await User.findById(tokenExists.user)
    user!.password = BcryptAdapter.hash(updatePassswordDto.password)

    try {
      await Promise.allSettled([tokenExists.deleteOne(), user!.save()])
      return {
        message: 'El password se modificó correctamente'
      }
    } catch (error) {
      throw CustomError.internalServer('Internal server error')
    }
  }

  public async login(loginDto: LoginDto) {
    const user = await User.findOne({ email: loginDto.email }) as IUser
    if (!user) throw CustomError.unauthorized('Usuario no registrado')
    if (!user.active) {
      const token = new Token()
      token.token = generateSixDigit()
      token.user = user._id

      this.sendEmailValidationLink(user, token)
      await token.save()
      throw CustomError.unauthorized('Usuario no confirmado, te hemos enviado un email de confirmación')
    }
    if (!BcryptAdapter.compare(loginDto.password, user.password)) throw CustomError.unauthorized('Password incorrecto')

    const token = await JwtAdapter.generateToken({ id: user._id })
    if (!token) throw CustomError.internalServer('Error en el servidor')

    return {
      message: 'Autenticado correctamente',
      token
    }
  }

  private async sendEmailValidationLink(user: IUser, token: IToken) {
    const link = `${envs.FRONTEND_URL}/auth/confirm-account`
    const html = `
      <div style="background-color: #ffffff; width: 90%; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; margin-bottom: 10px;">
            Hola: ${user.name}, confirma tu cuenta en UpTask
        </p>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-bottom: 10px;">
            Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace e ingresa el siguiente código: <b>${token.token}</b>
        </p>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-bottom: 10px;">
            Este token expira en 10 minutos.
        </p>
        <a href="${link}" style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; margin-top: 20px; border-radius: 5px; text-align: center;">
            Confirmar Cuenta
        </a>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-top: 20px; text-align: center;">
            Si tú no creaste esta cuenta, puedes ignorar este mensaje.
        </p>
      </div>
    `

    const isSent = await this.emailService.sendEmail({
      to: user.email,
      subject: 'UpTask - Confirmar tu cuenta',
      htmlBody: html
    })
    if (!isSent) throw CustomError.internalServer('Error al enviar el email')
  }

  private async sendEmailForgotPassword(user: IUser, token: IToken) {
    const link = `${envs.FRONTEND_URL}/auth/new-password`
    const html = `
      <div style="background-color: #ffffff; width: 90%; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; margin-bottom: 10px;">
            Hola: ${user.name}, reestablece tu password en UpTask
        </p>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-bottom: 10px;">
            Reestablece tu password en el siguiente enlace e ingresa el siguiente código: <b>${token.token}</b>
        </p>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-bottom: 10px;">
            Este token expira en 10 minutos.
        </p>
        <a href="${link}" style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; font-size: 16px; margin-top: 20px; border-radius: 5px; text-align: center;">
            Reestablecer password
        </a>
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; margin-top: 20px; text-align: center;">
            Si tú no hiciste esta acción, puedes ignorar este mensaje.
        </p>
      </div>
    `

    const isSent = await this.emailService.sendEmail({
      to: user.email,
      subject: 'UpTask - Reestablecer tu password',
      htmlBody: html
    })

    if (!isSent) throw CustomError.internalServer('Error sending email')
  }
}