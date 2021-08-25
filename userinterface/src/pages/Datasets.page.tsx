import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React, { FC, useEffect, useState } from 'react';
import { COMMAND_STATUS } from '../../../application/src/domain';
import { ICommandResult, IMetaData, IDataSetDefinition } from '../../../application/src/types';
import { getDataSets } from '../contract/api';

export const Datasets: FC = () => {

    const [datasets, datasetsSet] = React.useState<IDataSetDefinition[]>([]);    

    const [hash,hashSet]= useState(1)

    useEffect(()=>{
      const getData = async()=>{
        const result: ICommandResult = await getDataSets()
        if(result && result.status===COMMAND_STATUS.OK){            
          console.log(result.entity)
          datasetsSet(result.entity)
        }
      }
      getData()
    },[hash])
    

  return (
    <div className='pageContainer'>     
      <div className="informationentity-detail-card-tiles">
      {datasets.map((ds:IDataSetDefinition)=>{
        return <Card key={ds.metadata.Id} className="informationentity-detail-card-tile">
                  <CardContent>
                    <Typography  color="textSecondary" gutterBottom>
                      {ds.metadata.Id}                      
                    </Typography>
                    <Typography variant="h5" component="h2">
                    {ds.metadata.Name}                      
                    </Typography>
                    <Typography  color="textSecondary">
                      {ds.metadata.Description}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Quality: {ds.metadata.DatasetQuality}
                      <br />
                      Priority: {ds.metadata.Priority}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">More Info</Button>
                  </CardActions>
                </Card>              
      })}
      </div>
    </div>
  )
}
