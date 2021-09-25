export interface IModel {
  FileEvent: any;
  close: any;
}

export interface ICommandResult {
  status: string
  msg: string
  entity?: any // eslint-disable-line 
}


export type IFileEvent = {
  id: string
  type: string,
  datasetType: string
  blobId:string,
  filename: string;    
  username: string;
  createdBy: string
  createdAt: Date;
}

export type IUploadFileEvent = {  
  datasetType:string,
  fileData: string| ArrayBuffer,
  name: string,
  username:string, 
  filename:string,
  sliceNumber: number, 
  totalSlices: number
}

export interface IFileService {
  download: (datasetType:string, reference:string)=>Promise<String | null>
  downloadToFile: (filePath: string,datasetType:string, reference:string)=>Promise<void>
  sendBlock: (datasetType:string, content:string, key:string , sliceNumber: number , totalSlices: number,metadata:any)=>void
}


export interface IMetaData {
  eventType?: string,
  name?: string
  username?: string
  datasetType?: string
  filename?:string
  blobId?: string
  project?:string
  customer?:string
}

export interface IDataSetDefinition {
  name?: string
  metadata: any
}

export interface IEventService {  
  produce: (request:IMetaData[])=>Promise<void>  
}

export interface IEventHubConnectionProps {
  connectionString: string
  eventHubName: string
}