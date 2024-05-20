import { get } from 'env-var'
import 'dotenv/config'

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  DBNAME: get('DBNAME').required().asString(),
  MONGOURL: get('MONGOURL').required().asString(),
  FRONTEND_URL: get('FRONTEND_URL').required().asString(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString()
}