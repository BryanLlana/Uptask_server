import { Validators } from "../../config";
import Project from "../../data/mongo/models/project.model";
import { CreateProjectDto } from "../../domain/dto";
import { CustomError } from "../../domain/errors";

export class ProjectService {
  public async createProject (createProjectDto: CreateProjectDto) {
    try {
      await Project.create(createProjectDto)
      return {
        message: 'Proyecto creado correctamente'
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async getAllProjects () {
    try {
      const projects = await Project.find()
      return projects
    } catch (error) {
      console.log(error)
    }
  }

  public async getProjectById (id: string) {
    if (!Validators.isMongoId(id)) throw CustomError.badRequest('ID no válido')
    const project = await Project.findById(id).populate('tasks')
    if (!project) throw CustomError.notFound('Proyecto no encontrado')
    return project
  }

  public async updateProjectById (id: string, values: { [key: string]: any}) {
    if (Object.values(values).length === 0) throw CustomError.badRequest('Debes agregar mínimo un campo que quieras modificar')
    const project = await this.getProjectById(id)
    project.name = values.name || project.name
    project.customer = values.customer || project.customer
    project.description = values.description || project.description
    await project.save()
    return {
      message: 'Proyecto modificado correctamente'
    }
  }

  public async deleteProjectById (id: string) {
    const project = await this.getProjectById(id)
    try {
      await project.deleteOne()
      return {
        message: 'Proyecto eliminado correctamente'
      }
    } catch (error) {
      console.log(error)
    }
  }
}