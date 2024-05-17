import { envs } from "./config"
import { CorsAdapter } from "./config/adapter"
import { MongoDatabase } from "./data/mongo"
import { AppRoutes, Server } from "./presentation"

const main = async () => {
  await MongoDatabase.connect({ mongoUrl: envs.MONGOURL, dbName: envs.DBNAME })
  const server = new Server({ port: envs.PORT, routes: AppRoutes.routes, cors: CorsAdapter.create() })
  server.start()
}

main()