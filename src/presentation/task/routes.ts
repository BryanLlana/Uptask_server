import { Router } from "express";
import { TaskController } from "./controller";
import { ProjectService, TaskService } from "../services";
import { AuthMiddleware } from "../middlewares";

export class TaskRouter {
  static get routes(): Router {
    const router = Router()
    const projectService = new ProjectService()
    const taskService = new TaskService(projectService)
    const controller = new TaskController(taskService)

    router.use(AuthMiddleware.validateJwt)
    router.post('/:projectId', controller.createTaskInProject)
    router.get('/:projectId', controller.getTasksOfProject)
    router.get('/:projectId/:taskId', controller.getTaskOfProject)
    router.put('/:projectId/:taskId', controller.updateTaskOfProject)
    router.delete('/:projectId/:taskId', controller.deleteTaskOfProject)
    router.patch('/:projectId/:taskId', controller.updateStatusTaskOfProject)

    return router
  }
}