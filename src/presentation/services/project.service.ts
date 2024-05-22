import { Validators } from "../../config";
import Project from "../../data/mongo/models/project.model";
import { IUser } from "../../data/mongo/models/user.model";
import { CreateProjectDto } from "../../domain/dto";
import { CustomError } from "../../domain/errors";

export class ProjectService {
  public async createProject (createProjectDto: CreateProjectDto, user: IUser) {
    try {
      await Project.create({
        ...createProjectDto,
        manager: user._id
      })
      return {
        message: 'Proyecto creado correctamente'
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async getAllProjects (user: IUser) {
    try {
      const projects = await Project.find({
        manager: user._id
      })
      return projects
    } catch (error) {
      console.log(error)
    }
  }

  public async getProjectById (id: string, user: IUser) {
    if (!Validators.isMongoId(id)) throw CustomError.badRequest('ID no válido')
    const project = await Project.findById(id).populate('tasks')
    if (!project) throw CustomError.notFound('Proyecto no encontrado')

    if (project.manager.toString() !== user._id.toString()) {
      throw CustomError.unauthorized('Acción no válida')
    }

    return project
  }

  public async updateProjectById (id: string, values: { [key: string]: any}, user: IUser) {
    if (Object.values(values).length === 0) throw CustomError.badRequest('Debes agregar mínimo un campo que quieras modificar')
    const project = await this.getProjectById(id, user)
    project.name = values.name || project.name
    project.customer = values.customer || project.customer
    project.description = values.description || project.description
    await project.save()
    return {
      message: 'Proyecto modificado correctamente'
    }
  }

  public async deleteProjectById (id: string, user: IUser) {
    const project = await this.getProjectById(id, user)
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