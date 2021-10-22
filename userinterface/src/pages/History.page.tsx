import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import React, { FC, useEffect, useState } from 'react'
import { COMMAND_STATUS } from '../../../application/src/domain'
import { ICommandResult, IFileEvent } from '../../../application/src/types'
import { getFileEvents } from '../contract/api'

export const History: FC = () => {
  const [fileevents, fileeventsSet] = React.useState<IFileEvent[]>([])

  const [download,downloadSet]  = useState(false)
  const [hash, hashSet] = useState(1)


  const handleDownload = (fileevent:IFileEvent)=>()=>{
    downloadSet(true)
  }

  useEffect(() => {
    const getData = async () => {
      const result: ICommandResult = await getFileEvents()
      if (result && result.status === COMMAND_STATUS.OK) {        
        fileeventsSet(result.entity)
      }
    }
    getData()
  }, [hash])

  return (
    <div className='pageContainer'>
      <div className='detail-tiles'>
        {fileevents.map((fe: IFileEvent) => {
          return (
            <Card key={fe.blobId} className='detail-tile data-tile'>
              <CardContent>
                <Typography color='textSecondary' gutterBottom>
                  {fe.blobId}
                </Typography>
                <Typography variant='h5' component='h2'>
                  {fe.filename}
                </Typography>
                <Typography color='textSecondary'>{fe.datasetType}</Typography>
                <Typography variant='body2' component='p'>
                  {fe.username}
                  <br />
                  {fe.createdAt}
                </Typography>
              </CardContent>
              <CardActions>
                {download ? <Link href={`https://stacsvcdatasetsapi.z8.web.core.windows.net/#/dataset/${fe.datasetType}/1`}>Download from the Dataset Catalogue</Link> : <Button size='small' onClick={handleDownload(fe)}>Download</Button>}
              </CardActions>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
