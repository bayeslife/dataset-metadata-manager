import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DataRouting from 'DataRoutingRemote/DataRouting';
import React, { FC, useState } from 'react';
import { IMetaData } from '../../../application/src/types';
import { DataSetTypeSelection, ProjectSelect, Uploader, User, UserProfile } from '../components';
import { createFileEvent } from '../contract/api';

export interface IMetaDataSectionDefinition {
  name: string
  about: string
  component: React.ReactElement
}

export const Upload: FC = () => {

  const [expanded, setExpanded] = useState<string | false>(false);
  
  const [metadata,metadataSet] = useState<IMetaData>({})

  const handleProjectChange=()=>{
  }

  

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const callback = (update:any)=>{
    if(update && metadata){      
      const changes = Object.keys(update).map((key:string)=>update[key]!==(metadata as any)[key]).filter(n=>n)      
      if(changes.length>0)
        metadataSet({...metadata,...update})    
    }
  }

  const handleFileUpload= async (filename:string,blobId:string)=>{  
    const newMetaData = {
      ...metadata,filename,
      blobId,
      eventType: DataRouting.EVENT_TYPES.DATASET_UPLOADED
    }
    metadataSet(newMetaData)    
    await createFileEvent(newMetaData)
  }
  
  const metadataDefinitions : IMetaDataSectionDefinition [] = [
    {
      name: "Data Set",
      about: "Data Set",
      component: <DataSetTypeSelection callback={callback}/> 
    }, 
    {
      name: "Your Details",
      about: "Details of uploader",
      component: <User/> 
    }, 
    {
      name: "Commercials",
      about: "What project/client does this data set relate to",
      component: <ProjectSelect/>
    },  
    {
      name: "Location",
      about: "What location does this dataset relate to",
      component: <div>
          <div>
              Site Location Latitude:<input type="text" id="latitude" name="latitude" value="0" onChange={handleProjectChange}/> Longitude:<input type="text" id="longitude" name="longitude" value="0" onChange={handleProjectChange}/>
          </div>
      </div>
    }, 
    {
      name: "Practice",
      about: "What business practice does this relate to",
      component: <div>Practice Details</div>
    },
    {
      name: "Capability",
      about: "What business capability does this relate to",
      component: <div>Capablity Details</div>
    },
    {
      name: "Information Classification",
      about: "How sensitive is the information",
      component: <div>Classification Details</div>
    },
    {
      name: "Upload",
      about: "Upload file(s)",
      component: <Uploader datasetType={metadata?.datasetType||''} callback={handleFileUpload}/>
    }
  ]

  callback(UserProfile())


  return (
    <div className='pageContainer'>
      <div className='pageTitle'>
        <h2>Upload a Data Set or Data Set Component</h2></div>
      <div className='pageContent'>

        {metadataDefinitions.map((md:IMetaDataSectionDefinition)=>{
            return <Accordion key={md.name} expanded={expanded === md.name} onChange={handleChange(md.name)}>
              <AccordionSummary            
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className="AccordianHeading">{md.name}</Typography>
                <Typography className="AccordianSecondaryHeading">{md.about}</Typography>
              </AccordionSummary>
              <AccordionDetails className="AccordianDetails">
                {md.component}
              </AccordionDetails>
            </Accordion>
        })}        
      </div>      
    </div>
  )
}
