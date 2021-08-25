import React, { FC, useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { User, UserProfile, ProjectSelect, Uploader, DataSetTypeSelection } from '../components'
import {postFileSlice, createFileEvent } from '../contract/api'
import { IMetaData } from '../../../application/src/types';

export interface IMetaDataSectionDefinition {
  name: string
  about: string
  component: React.ReactElement
}

export const Upload: FC = () => {

  const [expanded, setExpanded] = useState<string | false>(false);
  const [path,pathSet]= useState()

  const [metadata,metadataSet] = useState<IMetaData>({})

  
  // const handleUpload = ()=> {    
  //   window.postMessage({ 
  //     type: 'upload'     
  //   },'*')
  // }

  // const handleChooseFile = ()=> {    
  //   window.postMessage({ 
  //     type: 'show-chooser'     
  //   },'*')
  // }

  // const handleFileChange=(event:any)=>{    
  //   pathSet(event.target.value)
  // }

  const handleProjectChange=()=>{

  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const callback = (update:any)=>{
    if(update){
      const changes = Object.keys(update).map((key:string)=>update[key]!==(metadata as any)[key]).filter(n=>n)      
      if(changes.length>0)
        metadataSet({...metadata,...update})    
    }
  }

  const handleFileUpload= async (filename:string,blobId:string)=>{
    const newMetaData = {...metadata,filename,blobId}
    metadataSet(newMetaData)    
    await createFileEvent(newMetaData)
  }
  
  const metadataDefinitions : IMetaDataSectionDefinition [] = [
    {
      name: "Data Set Type",
      about: "Data Set Type",
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
