import { Request, Response } from "express"
import { CreateProjectDto, UpdateProjectDto } from "../../domain/dto"
import { ProjectService } from "../services"
import { CustomError } from "../../domain/errors"

export class ProjectController {
  constructor(
    private readonly projectService: ProjectService
  ){}

  private handleError (error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    console.log(`${error}`)
    return res.status(500).json({ error: 'Internal server error'})
  }

  public createProject = (req: Request, res: Response) => {
    const [errors, createProjectDto] = CreateProjectDto.create(req.body)
    if (errors) return res.status(400).json({ errors })
    
    this.projectService.createProject(createProjectDto!, req.body.user)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public getAllProjects = (req: Request, res: Response) => {
    this.projectService.getAllProjects(req.body.user)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public getProjectById = (req: Request, res: Response) => {
    this.projectService.getProjectById(req.params.id, req.body.user)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public updateProjectById = (req: Request, res: Response) => {
    const [errors, updateProjectDto] = UpdateProjectDto.create(req.body)
    if (errors) return res.status(400).json({ errors })
    this.projectService.updateProjectById(req.params.id, updateProjectDto!.values, req.body.user)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }

  public deleteProjectById = (req: Request, res: Response) => {
    this.projectService.deleteProjectById(req.params.id, req.body.user)
      .then(result => res.status(200).json(result))
      .catch(error => this.handleError(error, res))
  }
}