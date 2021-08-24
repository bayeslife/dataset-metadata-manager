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
  type: string,
  id:string,
  description: string;  
  createdBy: string;
  createdAt: Date;  
}


export interface IFileService {
  download: (datasetType:string, reference:string)=>Promise<String | null>
  downloadToFile: (filePath: string,datasetType:string, reference:string)=>Promise<void>
  sendBlock: (datasetType:string, content:string, key:string , sliceNumber: number , totalSlices: number)=>void
}


export interface IMetaData {
  datasetType?: string
  filename?:string
  blobId?: string
  project?:string
  customer?:string
}

export interface IEventService {  
  produce: (request:IMetaData[])=>Promise<void>  
}

export interface IEventHubConnectionProps {
  connectionString: string
  eventHubName: string
}