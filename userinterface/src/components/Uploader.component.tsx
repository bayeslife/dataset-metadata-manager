import CircularProgress from '@material-ui/core/CircularProgress';
import React, { FC, useState } from 'react'
import { v4 as uuid } from 'uuid'
import {postFileSlice, createFileEvent } from '../contract/api'

interface IUploaderProps {
  metadata: any
}

export const Uploader : FC<IUploaderProps> = (props)=>{

    const {metadata} = props
    
    var SLICE_SIZE = 1 * 1000 * 1024;

    const [value, setValue] = useState('')
    const [hash,hashSet]=useState(1)
    const [uploading,uploadingSet] = useState(false)

    const [progress,progressSet] = useState<number>(0)
    const [total,totalSet] = useState<number>(0)  

    const progressPercentage = total ?  Math.floor(100*(progress/(total-1))) : 0
        
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        uploadingSet(true)
        const blobId = uuid()
        try {
          if (e.target && e.target.files && e.target.files.length > 0) {
            
            const file = e.target.files[0]
    
            const totalSlices = Math.floor(file.size/SLICE_SIZE)+  (file.size % SLICE_SIZE ? 1 : 0)
            totalSet(totalSlices)
                  
            const uploadSlice = (start:number,sliceNumber:number)=>{
              const fileReader = new FileReader()
                        
              var next_slice = start + SLICE_SIZE + 1;
              var blob = file.slice( start, next_slice );
                      
              const handleFile = async (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                  const content = e.target.result
                  await postFileSlice(metadata.DatasetType,content,blobId,sliceNumber,totalSlices)              
                  if ( next_slice < file.size ) {                
                    uploadSlice(next_slice,sliceNumber+1)
                    progressSet(sliceNumber)
                  }else {
                    await createFileEvent(file.name,blobId) 
                    totalSet(-1)
                    hashSet(hash+1)
                    uploadingSet(false)
                  }
                }
              }
              fileReader.onloadend = handleFile
              fileReader.readAsDataURL( blob );
            }
            uploadSlice(0,0)  
    
          }
        } catch (ex) {
          console.log('error', ex)
        }
    }

    if(uploading)
      return <CircularProgress variant="determinate" value={progressPercentage} />
    else 
     return <input type='file' onChange={(e) => handleUpload(e)} value={value} /> 
}




