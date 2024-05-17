import { Router } from "express";
import { ProjectController } from "./controller";
import { ProjectService } from "../services";

export class ProjectRouter {
  static get routes (): Router {
    const router = Router()
    const service = new ProjectService()
    const controller = new ProjectController(service)

    router.post('/', controller.createProject)
    router.get('/', controller.getAllProjects)
    router.get('/:id', controller.getProjectById)
    router.put('/:id', controller.updateProjectById)
    router.delete('/:id', controller.deleteProjectById)

    return router
  }
}