import { IProjectMember, IRequestCreateProject, IRequestUpdateProject } from './projects'
import { ProjectSortMode } from '../enums/ProjectSortMode'

export interface IRequestTokenProps {
  token?: string
}

export interface IRequestProjectPhaseProps {
  token?: string
  projectId: string
  phaseId: string
}

export interface IRequestPhaseProps {
  token?: string
  phaseId: string
}

export interface IRequestEmailProps {
  token?: string
  email: string
}

export interface IRequestUserProps {
  token?: string
  userId: string
  email: string
  phaseId: string
  projectAdmin: boolean
  name: string
  categoryId: string
}

export interface IResendInviteProps {
  token?: string
  userId: string
  email: string
  phaseId: string
  name: string
}

export interface IRequestAdminProps {
  token?: string
  userIds: string[]
}

export interface IRequestRemoveUserProps {
  token?: string
  projectMemberId: string
  phaseId: string
}

export interface IRequestCreateProjectProps {
  token?: string
  project: IRequestCreateProject
}

export interface IRequestUpdateProjectProps {
  token?: string
  project: IRequestUpdateProject
}

export interface IRequestProjectMemberProps {
  token?: string
  user: IProjectMember
}

export interface IPatchUserProps {
  token?: string
  name?: string
  password?: string
}

export interface IRequestMyProject {
  token?: string
  textSearch: string
  sortMode: ProjectSortMode
}
