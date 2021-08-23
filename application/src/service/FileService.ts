import Debug from "debug";
import { IFileService} from '../types'
import {BlobServiceClient,ContainerClient, BlockBlobClient,BlockBlobTier} from '@azure/storage-blob'
const debug = Debug("FileService");

export const FileService = async (config:any) : Promise<IFileService> => {
  
    let blobServiceClient: BlobServiceClient | null = null // eslint-disable-line    
    debug(`Azure Storage Client ${config.connectionString} and ${config.bucket}`)
  
    const createClient = async () => {
      if (blobServiceClient == null) {
        blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString)        
        return blobServiceClient
      }
      return blobServiceClient
    }
    createClient()

  const sendBlock = async (datasetType: string, content:string, name: string, sliceNumber: number, totalSlices: number)=> {    
    if(blobServiceClient){
      const containerClient = blobServiceClient.getContainerClient(datasetType.toLowerCase());      
      let prefix = 'aaaaaaaa'
      let sliceNumberStr = ''+sliceNumber
      const blockBlobClient : BlockBlobClient = containerClient?.getBlockBlobClient(name);
      const blockId = `${prefix.slice(0,8-sliceNumberStr.length)}${sliceNumberStr}`     
      const b = Buffer.from(content,'base64')         
      debug(`sendBlock: ${content.length} ${name} ${sliceNumber} ${totalSlices}`)
      await blockBlobClient.stageBlock(blockId,b,b.length)      
      if(sliceNumber+1==totalSlices){
        const blocks = []
        for(var i=0;i<totalSlices;i++){
          let sliceNumberStr = ''+i
          const blockId = `${prefix.slice(0,8-sliceNumberStr.length)}${sliceNumberStr}`
          blocks.push(blockId)
        }
        debug(`Commiting Blocks ${blocks}`)
        blockBlobClient.commitBlockList(blocks)
      }
    }
  }
  
  const download =async (datasetType: string, reference:string) : Promise<String | null>  => {    
    if(!blobServiceClient) return null
    
    const containerClient = blobServiceClient.getContainerClient(datasetType);      
    const blockBlobClient : BlockBlobClient = containerClient.getBlockBlobClient(reference);
    const binaryBuffer: Buffer = await blockBlobClient.downloadToBuffer()
    return binaryBuffer.toString('base64')
  }

  return {   
    download, 
    sendBlock
  };
};