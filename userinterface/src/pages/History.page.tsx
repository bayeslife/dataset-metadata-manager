import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { FC, useEffect, useState } from 'react';
import { COMMAND_STATUS } from '../../../application/src/domain';
import { ICommandResult, IMetaData, IFileEvent } from '../../../application/src/types';
import { getFileEvents } from '../contract/api';


export const History: FC = () => {

    const [fileevents, fileeventsSet] = React.useState<IFileEvent[]>([]);    

    const [hash,hashSet]= useState(1)

    useEffect(()=>{
      const getData = async()=>{
        const result: ICommandResult = await getFileEvents()
        if(result && result.status===COMMAND_STATUS.OK){            
          console.log(result.entity)
          fileeventsSet(result.entity)
        }
      }
      getData()
    },[hash])
    

  return (
    <div className='pageContainer'>     
      <div className="detail-tiles">
      {fileevents.map((fe:IFileEvent)=>{
        return <Card key={fe.blobId} className="detail-tile data-tile">
                  <CardContent>
                    <Typography  color="textSecondary" gutterBottom>
                      {fe.blobId}
                    </Typography>
                    <Typography variant="h5" component="h2">
                     {fe.filename}
                    </Typography>
                    <Typography  color="textSecondary">
                      {fe.datasetType}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {fe.username}
                      <br />
                      {fe.createdAt}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Download</Button>
                  </CardActions>
                </Card>              
      })}
      </div>
    </div>
  )
}
