import mongoose from 'mongoose'
import colors from 'colors'

type Options = {
  dbName: string
  mongoUrl: string
}

export class MongoDatabase {
  static async connect(options: Options) {
    try {
      const db = await mongoose.connect(options.mongoUrl, {
        dbName: options.dbName
      })
      console.log(colors.bold.green(`Mongo connected: ${db.connection.host}:${db.connection.port}`))
    } catch (error) {
      console.log(colors.bold.red('Mongo connection error'))
      throw error
    }
  }

  static async disconnect() {
    await mongoose.disconnect()
  }
}