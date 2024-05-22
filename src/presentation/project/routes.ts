import { Router } from "express";
import { ProjectController } from "./controller";
import { ProjectService } from "../services";
import { AuthMiddleware } from "../middlewares";

export class ProjectRouter {
  static get routes (): Router {
    const router = Router()
    const service = new ProjectService()
    const controller = new ProjectController(service)

    router.post('/', AuthMiddleware.validateJwt, controller.createProject)
    router.get('/', AuthMiddleware.validateJwt, controller.getAllProjects)
    router.get('/:id', AuthMiddleware.validateJwt, controller.getProjectById)
    router.put('/:id', AuthMiddleware.validateJwt, controller.updateProjectById)
    router.delete('/:id', AuthMiddleware.validateJwt, controller.deleteProjectById)

    return router
  }
}