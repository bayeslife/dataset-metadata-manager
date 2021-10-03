import CircularProgress from '@mui/material/CircularProgress'
import React, { FC, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { postFileSlice, createFileEvent } from '../contract/api'
import md5 from 'md5'
import { azureBlobFolderNameTransform } from '../../../application/src/service/CloudService'
import RemoteConfigData from 'ApplicationFrameRemote/ConfigData'

import { IUploadFileEvent } from '../../../application/src/types'

interface IUploaderProps {
  datasetType: string
  callback: (filename: string, blobId: string) => void
}

export const Uploader: FC<IUploaderProps> = (props) => {
  const { datasetType, callback } = props

  const SLICE_SIZE = 1 * 1000 * 1024

  const [value, setValue] = useState('')
  const [hash, hashSet] = useState(1)
  const [uploading, uploadingSet] = useState(false)

  const [progress, progressSet] = useState<number>(0)
  const [total, totalSet] = useState<number>(0)

  const msalAccountStr = window.localStorage.getItem('msal-account')
  const msalAccount = msalAccountStr ? JSON.parse(msalAccountStr) : { name: '' }

  const progressPercentage = total ? Math.floor(100 * (progress / (total - 1))) : 0

  const getFileSignature = (signatureBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = function (event: any) {
        if (event && event.target) {
          const fileDataUrl = event.target.result as string
          const signature = fileDataUrl.replace('data:application/octet-stream;base64.', '')
          resolve(signature)
        } else reject()
      }
      reader.readAsDataURL(signatureBlob)
    })
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadingSet(true)
    try {
      if (e.target && e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]

        let extension = ''
        if (file.name.lastIndexOf('.') >= 0) {
          extension = file.name.substring(file.name.lastIndexOf('.'))
        }

        const signatureBlob = file.slice(0, 1024)
        const signature = await getFileSignature(signatureBlob)
        const fileHash = md5(signature)
        const storedFileName = `${fileHash}${extension}`
        const totalSlices = Math.floor(file.size / SLICE_SIZE) + (file.size % SLICE_SIZE ? 1 : 0)
        const contenttype = file.type

        const uploadSlice = (start: number, sliceNumber: number) => {
          const fileReader = new FileReader()

          const next_slice = start + SLICE_SIZE + 1
          const blob = file.slice(start, next_slice)

          const handleFile = async (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
              const content = e.target.result

              const event: IUploadFileEvent = {
                filename: file.name,
                username: msalAccount.username,
                fileData: content,
                datasetType: azureBlobFolderNameTransform(datasetType),
                name: storedFileName,
                sliceNumber,
                totalSlices,
                contenttype,
              }

              await postFileSlice(event)
              if (next_slice < file.size) {
                uploadSlice(next_slice, sliceNumber + 1)
                progressSet(sliceNumber)
              } else {
                callback(file.name, storedFileName)
                totalSet(-1)
                hashSet(hash + 1)
                uploadingSet(false)
              }
            }
          }
          fileReader.onloadend = handleFile
          fileReader.readAsDataURL(blob)
        }
        uploadSlice(0, 0)
      }
    } catch (ex) {
      console.log('error', ex)
    }
  }

  if (uploading) return <CircularProgress variant='determinate' value={progressPercentage} />
  else {
    return (
      <div>
        {!datasetType && <div className='error'>Please select a Data Set Type</div>}
        <input type='file' onChange={(e) => handleUpload(e)} disabled={!datasetType} value={value} />
      </div>
    )
  }
}
