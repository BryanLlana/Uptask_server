import { Router } from "express";
import { ProjectRouter } from "./project";
import { TaskRouter } from "./task";

export class AppRoutes {
  static get routes (): Router {
    const router = Router()

    router.use('/api/project', ProjectRouter.routes)
    router.use('/api/task', TaskRouter.routes)

    return router
  }
}