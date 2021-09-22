import Debug from "debug";
import { IFileService} from '../types'
import {BlobServiceClient,ContainerClient, BlockBlobClient,BlockBlobTier} from '@azure/storage-blob'
import fs from 'fs'
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

  const sendBlock = async (datasetType: string, content:string, name: string, sliceNumber: number, totalSlices: number,metadata:any)=> {    
    if(blobServiceClient){
      const container = datasetType.toLowerCase()

      try {
        if(sliceNumber===0){
          await blobServiceClient.createContainer(container)
        }          
      }catch(err){
        debug(err)
      }

      const containerClient = blobServiceClient.getContainerClient(container)
      let prefix = 'aaaaaaaa'
      let sliceNumberStr = ''+sliceNumber
      debug(`sendBlock: ${content.length} ${container} ${name} ${sliceNumber} ${totalSlices}`)
      const blockBlobClient : BlockBlobClient = containerClient?.getBlockBlobClient(name);
      const blockId = `${prefix.slice(0,8-sliceNumberStr.length)}${sliceNumberStr}`     
      const b = Buffer.from(content,'base64')               
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
        blockBlobClient.setMetadata(metadata)
      }
    }
  }
  
  const download =async (datasetType: string, reference:string) : Promise<String | null>  => {    
    if(!blobServiceClient) return null
    
    const containerClient = blobServiceClient.getContainerClient(datasetType);
    const blockBlobClient : BlockBlobClient = containerClient.getBlockBlobClient(reference);
    const binaryBuffer: Buffer = await blockBlobClient.downloadToBuffer()
    return binaryBuffer.toString('utf-8')    
  }

  const downloadToFile = async (localFilePath:string, datasetType: string, reference:string) : Promise<void> => {    
      if(blobServiceClient){
        const containerClient = blobServiceClient?.getContainerClient(datasetType);  
        const pageBlobClient = containerClient.getPageBlobClient(reference)            
        await pageBlobClient.downloadToFile(localFilePath)
      }else
        throw "No blob service client"
  }

  return {   
    download, 
    downloadToFile,
    sendBlock
  };
};
