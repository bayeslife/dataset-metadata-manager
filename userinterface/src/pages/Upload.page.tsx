import React, { FC, useState } from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { User, ProjectSelect, Uploader, DataSetTypeSelection } from '../components'

export interface IMetaDataDefinition {
  name: string
  about: string
  component: React.ReactElement
}

export const Upload: FC = () => {

  const [expanded, setExpanded] = useState<string | false>(false);
  const [path,pathSet]= useState()

  const [metadata,metadataSet] = useState<any>()

  const handleUpload = ()=> {    
    window.postMessage({ 
      type: 'upload'     
    },'*')
  }

  const handleChooseFile = ()=> {    
    window.postMessage({ 
      type: 'show-chooser'     
    },'*')
  }

  const handleFileChange=(event:any)=>{    
    pathSet(event.target.value)
  }

  const handleProjectChange=()=>{

  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const callback = (update:any)=>{
    metadataSet({...metadata,...update})    
  }

  console.log(metadata)

  const metadataDefinitions : IMetaDataDefinition [] = [
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
      component: <Uploader metadata={metadata}/>
    }
  ]

  return (
    <div className='pageContainer'>
      <div className='pageTitle'>
        <h1>Upload a Data Set</h1></div>
      <div className='pageContent'>

        {metadataDefinitions.map((md:IMetaDataDefinition)=>{
            return <Accordion expanded={expanded === md.name} onChange={handleChange(md.name)}>
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
