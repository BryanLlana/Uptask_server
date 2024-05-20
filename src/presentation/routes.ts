import { Router } from "express";
import { ProjectRouter } from "./project";
import { TaskRouter } from "./task";
import { AuthRoutes } from "./auth";

export class AppRoutes {
  static get routes (): Router {
    const router = Router()

    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/project', ProjectRouter.routes)
    router.use('/api/task', TaskRouter.routes)

    return router
  }
}