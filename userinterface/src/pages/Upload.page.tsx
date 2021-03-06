import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoteDataRouting from 'DataRoutingRemote/DataRouting'
import RemoteDatasetEvent from 'DataRoutingRemote/DatasetEvent'
import RemoteDataShare from 'DataSharingRemote/DataShare'
import React, { FC, useState } from 'react'
import { IMetaData } from '../../../application/src/types'
import { DataSetTypeSelection, ProjectSelect, Uploader, User, UserProfile } from '../components'
import { createFileEvent } from '../contract/api'
import { WINDOW_STORAGE_SELECTED_DATASET } from '../../../application/src/domain'
import Snackbar from '@mui/material/Snackbar'


export interface IMetaDataSectionDefinition {
  name: string
  about: string
  component: React.ReactElement
  enabled: boolean
}

export const Upload: FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false)
  const [open, openSet] = useState(false)
  const [openMessage, openMessageSet] = useState('')

  const selectedDataset = window.localStorage.getItem(WINDOW_STORAGE_SELECTED_DATASET)
  const selectedMetadata = selectedDataset ? JSON.parse(selectedDataset) : null
  const [metadata, metadataSet] = useState<IMetaData>({ datasetType: selectedMetadata?.metadata.Id })

  const handleClose = () => {
    openSet(false)
  }

  const handleProjectChange = () => {
    console.log('unused')
  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  

  const callback = (update: any) => {
    if (update && metadata) {
      const changes = Object.keys(update)
        .map((key: string) => update[key] !== (metadata as any)[key])
        .filter((n) => n)
      if (changes.length > 0) metadataSet({ ...metadata, ...update })
    }
  }

  const handleFileUpload = async (filename: string, blobId: string) => {
    openMessageSet('File uploaded')
    openSet(true)
    const newMetaData = {
      ...metadata,
      id: `${Date.now()}`,
      timestamp: Date.now(),
      filename,
      blobId,
      eventType: RemoteDataRouting.EVENT_TYPES.DATASET_UPLOADED,
    }
    metadataSet(newMetaData)
    await RemoteDatasetEvent.createDatasetEvent(newMetaData)        
    await createFileEvent(newMetaData)
  }

  const handleShareMetadata = (shareMetadata: any)=>{
    metadataSet({...metadata,...shareMetadata})
  }

  const metadataDefinitions: IMetaDataSectionDefinition[] = [
    {
      name: 'Data Set',
      about: selectedMetadata ? selectedMetadata?.name : 'Select a dataset',
      component: <DataSetTypeSelection callback={callback} />,
      enabled: true
    },
    {
      name: 'Your Details',
      about: 'Details of uploader',
      component: <User />,
      enabled: true
    },
    {
      name: 'Commercials',
      about: 'What project/client does this data set relate to',
      component: <ProjectSelect />,
      enabled: false
    },
    {
      name: 'Location',
      about: 'What location does this dataset relate to',
      component: (
        <div>
          <div>
            Site Location Latitude:
            <input
              type='text'
              id='latitude'
              name='latitude'
              value='0'
              onChange={handleProjectChange}
              disabled={true}
            />{' '}
            Longitude:
            <input
              type='text'
              id='longitude'
              name='longitude'
              value='0'
              onChange={handleProjectChange}
              disabled={true}
            />
          </div>
        </div>
      ),
      enabled: false
    },
    {
      name: 'Practice',
      about: 'What business practice does this relate to',
      component: <div>Practice Details</div>,
      enabled: false
    },
    {
      name: 'Capability',
      about: 'What business capability does this relate to',
      component: <div>Capablity Details</div>,
      enabled: false
    },
    {
      name: 'Information Sharing/Classification',
      about: 'How sensitive is the information',
      component: <div><RemoteDataShare metadataCallback={handleShareMetadata}/></div>,
      enabled: true
    },
    {
      name: 'Upload',
      about: 'Upload file(s)',
      component: <Uploader metadata={metadata} callback={handleFileUpload} />,
      enabled: true
    },
  ]

  callback(UserProfile())

  return (
    <div className='pageContainer'>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={openMessage} />
      <div className='pageTitle'>
        <h2>Upload a Data Set or Data Set Component</h2>
      </div>
      <div className='pageContent'>
        {metadataDefinitions.map((md: IMetaDataSectionDefinition) => {
          return (
            <Accordion key={md.name} expanded={expanded === md.name} onChange={handleChange(md.name)} disabled={!md.enabled}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1bh-content' id='panel1bh-header'>
                <Typography className='AccordianHeading'>{md.name}</Typography>
                <Typography className='AccordianSecondaryHeading'>{md.about}</Typography>
              </AccordionSummary>
              <AccordionDetails className='AccordianDetails'>{md.component}</AccordionDetails>
            </Accordion>
          )
        })}
      </div>
    </div>
  )
}
