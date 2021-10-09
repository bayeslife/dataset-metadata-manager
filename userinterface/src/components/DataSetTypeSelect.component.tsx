import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import React, { FC, useEffect, useState } from 'react'
import { COMMAND_STATUS } from '../../../application/src/domain'
import { ICommandResult, IDataSetDefinition } from '../../../application/src/types'
import { getDataSets } from '../contract/api'
import { WINDOW_STORAGE_SELECTED_DATASET } from '../../../application/src/domain/index'
import { IMetaData } from '../../../application/src/types'

interface IDataSetTypeSelect {
  callback: (metadata: any) => void
}

export const DataSetTypeSelection: FC<IDataSetTypeSelect> = (options: any) => {
  const { callback } = options

  const selectedDataset = window.localStorage.getItem(WINDOW_STORAGE_SELECTED_DATASET)
  const selectedMetadata = selectedDataset ? JSON.parse(selectedDataset) : {}
  const [datasetType, datasetTypeSet] = React.useState<any>(selectedMetadata)
  const [hash, hashSet] = useState(1)

  const [datasetTypes, datasetTypesSet] = React.useState<any[]>([])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const val: string = event.target.value as string

    //console.log(val)
    const metadata = datasetTypes.find((m: any) => m.metadata.Id === val)
    //console.log(metadata)
    if (metadata) {
      window.localStorage.setItem(WINDOW_STORAGE_SELECTED_DATASET, JSON.stringify(metadata))
      datasetTypeSet(metadata)
      callback({ datasetType: val })
      event.preventDefault()
    }
  }

  useEffect(() => {
    const getData = async () => {
      const result: ICommandResult = await getDataSets()
      if (result && result.status === COMMAND_STATUS.OK) {
        //console.log(result.entity)
        datasetTypesSet(result.entity)
      }
    }
    getData()
  }, [hash])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField fullWidth select label='Data Set Type' value={datasetType.Name} onChange={handleChange}>
          {datasetTypes.map((datasetType) => (
            <MenuItem key={datasetType.name} value={datasetType.metadata.Id}>
              {datasetType.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  )
}
