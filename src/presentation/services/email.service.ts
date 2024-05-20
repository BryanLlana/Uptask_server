import nodemailer, { Transporter } from 'nodemailer'

interface Options {
  mailerEmail: string,
  mailerService: string,
  mailerSecretKey: string
}

interface SendEmailOptions {
  to: string | string[],
  subject: string,
  htmlBody: string
}

export class EmailService {
  private transporter: Transporter
  public readonly mailerEmail: string
  public readonly mailerService: string
  public readonly mailerSecretKey: string

  constructor (options: Options) {
    const { mailerEmail, mailerService, mailerSecretKey } = options
    this.mailerEmail = mailerEmail
    this.mailerService = mailerService
    this.mailerSecretKey = mailerSecretKey
    this.transporter = nodemailer.createTransport({
      service: this.mailerService,
      auth: {
        user: this.mailerEmail,
        pass: this.mailerSecretKey
      }
    })
  }

  public async sendEmail (options: SendEmailOptions): Promise<boolean> {
    const { to, subject, htmlBody } = options

    try {
      await this.transporter.sendMail({ to, subject, html: htmlBody })
      return true
    } catch (error) {
      console.log(error);
      return false
    }
  }
}
