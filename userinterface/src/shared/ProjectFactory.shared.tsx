import { createProject, deleteProject } from '../contract/api'
import { IProject } from '../../../application/src/types'

// eslint-disable-next-line
export const ProjectCreate = (project: IProject): Promise<any> => {
  return createProject(project)
}

// eslint-disable-next-line
export const ProjectSave = (project: IProject): Promise<any> => {
  return createProject(project)
}

// eslint-disable-next-line
export const ProjectDelete = (projectId: string): Promise<any> => {
  return deleteProject(projectId)
}
