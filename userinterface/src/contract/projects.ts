import { RoleType } from '../enums/UserRolesEnum'
import { headersWithToken, IResponse, TokenExpiryWrapper } from './api'
import {
  IRequestTokenProps,
  IRequestProjectPhaseProps,
  IRequestPhaseProps,
  IRequestCreateProjectProps,
  IRequestUpdateProjectProps,
  IRequestProjectMemberProps,
  IRequestMyProject,
} from './apiprops'
import { ProjectSortMode } from '../enums/ProjectSortMode'
import { IProject } from '../../../application/src/types'

const getProjectsRequest = async (props: IRequestTokenProps): Promise<IProject[] | null> => {
  const response = await fetch('/projects', { headers: headersWithToken(props.token) })
  if (response.ok) return response.json()
  throw response
}
export const getProjects = TokenExpiryWrapper(getProjectsRequest) //, [ProjectReadScope]

export interface IProjectData {
  id: string
  title: string
  client: string
  status: number
  Phases: IPhaseData[]
}

export interface IProjectSorting {
  sortMode: ProjectSortMode
  title?: string
  selected: boolean
}

export interface IProjectFilter {
  textSearch: string
  sortMode: ProjectSortMode
}

export interface IPhaseData {
  id: string
  phaseName: string
  displayOrder: number
  ProjectMembers: IProjectMember[]
  Categories: ICategoryData[]
}

export interface ICategoryData {
  id: string
  categoryName: string
  colour: number
}

const getMyProjectsRequest = async (props: IRequestMyProject): Promise<IProjectData[] | null> => {
  const response = await fetch(`/projects/my?textsearch=${props.textSearch}&sortmode=${props.sortMode}`, {
    headers: headersWithToken(props.token),
  })
  if (response.ok) return response.json()
  throw response
}
export const getMyProjects = TokenExpiryWrapper(getMyProjectsRequest)

const getAllProjectsRequest = async (props: IRequestTokenProps): Promise<IProjectData[] | null> => {
  const response = await fetch('/projects/all', {
    headers: headersWithToken(props.token),
  })
  if (response.ok) return response.json()
  throw response
}
export const getAllProjects = TokenExpiryWrapper(getAllProjectsRequest)

export interface IProjectDetails {
  projectId: string
  phaseId: string
  client: string
  title: string
  phaseName: string
  projectCode: string
  bounds: [[number, number], [number, number]]
  userRole?: number
}

interface IProjectDetailsResponse {
  details: IProjectDetails
  currentMemberId: string | null
}

export const getProjectDetailsByUserRequest = async (
  props: IRequestProjectPhaseProps,
): Promise<IProjectDetailsResponse | null> => {
  const url = `/projects/details/${props.projectId}/${props.phaseId}`
  const response = await fetch(url, {
    headers: headersWithToken(props.token),
  })
  if (response.ok) return response.json()
  throw response
}
export const getProjectDetailsByUser = TokenExpiryWrapper(getProjectDetailsByUserRequest)

export const categoryMaxColours = 12

export interface IUser {
  userId?: string
  name: string
  email: string
}

export interface IProjectUser {
  projectMemberId: string
  name: string
  email: string
  nickname: string
  userId: string
  userRole: RoleType
  pending: boolean
  categoryLead?: string
  phaseId?: string
  categoryId?: string
}

export interface IGlobalAdminProjectCategory {
  id?: string  
  name: string
  categoryLead: string
  phaseId: string
}

export const getProjectUsersRequest = async (props: IRequestProjectPhaseProps): Promise<IProjectUser[] | []> => {
  const url = `/projects/users/${props.projectId}/${props.phaseId}`
  const response = await fetch(url, {
    headers: headersWithToken(props.token),
  })
  if (response.ok) return response.json()
  throw response
}
export const getProjectUsers = TokenExpiryWrapper(getProjectUsersRequest)

export interface IAccessLevel {
  userRole: RoleType
}

const getPhaseAccessLevelRequest = async (props: IRequestPhaseProps): Promise<IAccessLevel> => {
  const url = `/projects/access/${props.phaseId}`
  const response = await fetch(url, {
    headers: headersWithToken(props.token),
  })
  if (response.ok) return response.json()
  throw response
}
export const getPhaseAccessLevel = TokenExpiryWrapper(getPhaseAccessLevelRequest)

export interface IRequestCreateProject {
  project: {
    title: string
    status: number
  }
  phase: {
    projectCode: string
    phaseName: string
  }  
  projectMembers: IProjectMember[]
}

export const createProjectDetailsRequest = async (props: IRequestCreateProjectProps): Promise<IResponse> => {
  const response = await fetch('/projects/details', {
    method: 'post',
    headers: headersWithToken(props.token),
    body: JSON.stringify(props.project),
  })
  const content = await response.json()
  return {
    success: response.ok,
    message: content.message,
  }
}
export const createProjectDetails = TokenExpiryWrapper(createProjectDetailsRequest)

export interface IRequestUpdateProject {
  projectId: string
  phaseId: string
  projectName: string
  projectCode: string
  phaseName: string
}

export const updateProjectDetailsRequest = async (props: IRequestUpdateProjectProps): Promise<IResponse> => {
  const response = await fetch('/projects/details', {
    method: 'put',
    headers: headersWithToken(props.token),
    body: JSON.stringify(props.project),
  })
  if (response.ok) return response.json()
  throw response
}
export const updateProjectDetails = TokenExpiryWrapper(updateProjectDetailsRequest)

export interface IProjectMember {
  projectMemberId: string
  userId: string
  phaseId: string
  userRole: RoleType
  pendingUserEmail: string
  name?: string
}

const updateProjectMemberRequest = async (props: IRequestProjectMemberProps): Promise<IResponse> => {
  const response = await fetch('/projects/user/update', {
    method: 'post',
    headers: headersWithToken(props.token),
    body: JSON.stringify(props.user),
  })
  if (response.ok) return response.json()
  throw response
}
export const updateProjectMember = TokenExpiryWrapper(updateProjectMemberRequest)
