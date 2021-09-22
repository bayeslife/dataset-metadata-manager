/* eslint-disable */
import { getAPI } from '../config'
import { IFileEvent, ICommandResult } from '../../../application/src/types'
import { COMMAND_STATUS } from '../../../application/src/domain'

const handleResponse = (res: Response) => {
  try {
    if (res.status === 401) {
      window.location.href = `/`
    } else if (res.status === 500) {
      return null
    } else {
      return res !== null ? res.json() : []
    }
  } catch (ex) {
    console.log(ex)
    return []
  }
}

export const headersWithToken = (token: string | undefined): HeadersInit => {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export interface IAPIRequest<T, U> {
  (props: T): Promise<U>
}

export function TokenExpiryWrapper<T, U>(
  apiCall: IAPIRequest<T, U>,
  // scopes: string[],
  // errorReturnValue: U,
): IAPIRequest<T, U> {
  //does nothing but could refresh the api token
  //const localToken = window.localStorage.getItem('AccessToken')
  return apiCall
}

export interface IResponse {
  success: boolean
  message?: string
  data?: any
}

// eslint-disable-file
const service = {
  get: (url: string, options: object) =>
    fetch(getAPI() + url, { ...options /*credentials: 'include'*/ }).then(handleResponse),
  post: (url: string, body: object, options: object = {}) =>
    fetch(getAPI() + url, {
      ...options,
      /*credentials: 'include',*/ method: 'POST',
      body: JSON.stringify(body),
    }).then(handleResponse),
  put: (url: string, body: object, options: object = {}) =>
    fetch(getAPI() + url, {
      ...options,
      /*credentials: 'include',*/ method: 'PUT',
      body: JSON.stringify(body),
    }).then(handleResponse),
  delete: (url: string, options: object = {}) =>
    fetch(getAPI() + url, {
      ...options,
      /*credentials: 'include',*/ method: 'DELETE',
    }).then(handleResponse),
}

export async function getApplicationConfig(): Promise<any> {
  const localToken = window.localStorage.getItem('AccessToken')
  return service.get(`/ConfigService`, {
    headers: { Authorization: `Bearer ${localToken}` },
  })
}

export async function postFileSlice(datasetType:string,content: string| ArrayBuffer,name: string,username:string, filename:string,sliceNumber: number, totalSlices: number): Promise<ICommandResult> {
  const localToken = window.localStorage.getItem('AccessToken')    
  return service.post(`/ModelService/file`, {
    filename,
    username,
    fileData: content,
    datasetType,
    name,
    sliceNumber,
    totalSlices
  },{
    headers: {      
      Authorization: `Bearer ${localToken}`,
    }
  })
}

export async function createFileEvent(metadata:any) {
  const localToken = window.localStorage.getItem('AccessToken')
  return service.post('/ModelService/fileevents', metadata, {
    headers: { Authorization: `Bearer ${localToken}` },
  })
}

export async function getDataSets() : Promise<ICommandResult> { 
   const localToken = window.localStorage.getItem('AccessToken')
  return fetch("https://quartile-one.gitlab.io/capabilities/datasets/datasetcatalogue/datasets.json", { }).then(async (res: Response)=>{
    const json = await res.json()
    return { status: COMMAND_STATUS.OK, msg: '', entity: json }
  })
}

export async function getFileEvents() : Promise<ICommandResult> { 
  const localToken = window.localStorage.getItem('AccessToken')  
  return service.get(`/ModelService/fileevents`, {
    headers: { Authorization: `Bearer ${localToken}` },
  })
}