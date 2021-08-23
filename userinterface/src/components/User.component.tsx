import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React from 'react';

export const User = ()=>{
    
    const msalAccountStr = window.localStorage.getItem('msal-account')
    const msalAccount = msalAccountStr ? JSON.parse(msalAccountStr): {name: ''}

    return <Grid container spacing={3}>
      <Grid item xs={4}> 
          <TextField fullWidth id="standard-basic" placeholder="1" label="Name" value={msalAccount.name}/>
          </Grid>
      <Grid item xs={4}>  
        <TextField fullWidth id="standard-basic" placeholder="1" label="UserName" value={msalAccount.username}/>                    
      </Grid>       
    </Grid>
}


