import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()
    const emailService = new EmailService({
      mailerService: envs.MAILER_SERVICE,
      mailerEmail: envs.MAILER_EMAIL,
      mailerSecretKey: envs.MAILER_SECRET_KEY
    })
    const service = new AuthService(emailService)
    const controller = new AuthController(service)

    router.post('/create-account', controller.createAccount)
    router.post('/confirm-account', controller.confirmAccount)
    router.post('/login', controller.login)
    router.post('/request-new-code', controller.requestNewCode)
    router.post('/forgot-password', controller.forgotPassword)
    router.post('/validate-token', controller.validateToken)
    router.post('/update-password/:token', controller.updatePassword)
    router.get('/user', AuthMiddleware.validateJwt, controller.getUser)

    return router
  }
}