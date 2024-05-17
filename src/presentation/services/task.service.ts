import { Validators } from "../../config";
import Task from "../../data/mongo/models/task.model";
import { CreateTaskDto } from "../../domain/dto";
import { CustomError } from "../../domain/errors";
import { ProjectService } from "./project.service";

export class TaskService {
  constructor(
    private readonly projectService: ProjectService
  ){}

  public async createTaskInProject (idProject: string, createTaskDto: CreateTaskDto) {
    const project = await this.projectService.getProjectById(idProject)
    try {
      const task = new Task(createTaskDto)
      task.project = idProject 
      project.tasks.push(task.id)
      await Promise.allSettled([task.save(), project.save()])
      return {
        message: 'Tarea creada correctamente'
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getTasksOfProject (idProject: string) {
    const project = await this.projectService.getProjectById(idProject)
    try {
      const tasks = await Task.find({
        project: project.id
      }).select({
        updatedAt: 0
      }).populate('project')
      return tasks
    } catch (error) {
      console.log(error);
    }
  }

  public async getTaskOfProject (idProject: string, idTask: string) {
    const project = await this.projectService.getProjectById(idProject)
    if (!Validators.isMongoId(idTask)) throw CustomError.badRequest('Id de tarea no válida')
    const task = await Task.findById(idTask)
    if (!task) throw CustomError.notFound('Tarea no encontrada')
    if (project.id !== task.project.toString()) throw CustomError.badRequest('Acción no válida')

    return task
  }
}