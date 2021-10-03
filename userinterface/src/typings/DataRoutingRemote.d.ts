declare module 'DataRoutingRemote/DataRouting' {
  declare const DataRouting: any
  export default DataRouting
}

declare module 'DataRoutingRemote/DatasetEvent' {
  declare const DatasetEvent: IDatasetEventHelper
  export default DatasetEvent

  export interface IDatasetEventHelper {
    createDatasetEvent: (event: any) => Promise<void>    
  }
}
