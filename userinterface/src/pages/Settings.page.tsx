import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import React, { FC, useState } from 'react'
import StyleSelect from 'StyleManagementRemote/StyleSelect'

interface ISettingsProps {
  id: string
}

export const STYLE_SELECT = 'style-selected'

export const Settings: FC<ISettingsProps> = (props) => {
  const onSelect = (value: string) => {
    localStorage.setItem(STYLE_SELECT, value)
  }

  return (
    <div className='pageContainerFullPage'>
      <div className='pageContent'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyleSelect onSelect={onSelect} />
          </Grid>
        </Grid>
        <hr />
      </div>
    </div>
  )
}
