import { Request, Response } from "express"
import { CustomError } from "../../domain/errors"
import { TaskService } from "../services"
import { CreateTaskDto } from "../../domain/dto"

export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ){}

  private handleError (error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error'})
  }

  public createTaskInProject = (req: Request, res: Response) => {
    const { projectId } = req.params
    const [errors, createTaskDto] = CreateTaskDto.create(req.body)

    if (errors) return res.status(400).json({ errors })
    this.taskService.createTaskInProject(projectId, createTaskDto!)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  } 

  public getTasksOfProject = (req: Request, res: Response) => {
    const { projectId } = req.params
    this.taskService.getTasksOfProject(projectId)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }
}