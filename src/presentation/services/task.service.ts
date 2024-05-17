import Task from "../../data/mongo/models/task.model";
import { CreateTaskDto } from "../../domain/dto";
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
}