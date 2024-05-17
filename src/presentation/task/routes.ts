import { Router } from "express";
import { TaskController } from "./controller";
import { ProjectService, TaskService } from "../services";

export class TaskRouter {
  static get routes(): Router {
    const router = Router()
    const projectService = new ProjectService()
    const taskService = new TaskService(projectService)
    const controller = new TaskController(taskService)

    router.post('/:projectId', controller.createTaskInProject)
    router.get('/:projectId', controller.getTasksOfProject)

    return router
  }
}