import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React,{FC} from 'react';
interface IUserProps {    
}

export const UserProfile = ()=>{
    const msalAccountStr = window.localStorage.getItem('msal-account')
    const msalAccount = msalAccountStr ? JSON.parse(msalAccountStr): {name: ''} 
    return {name: msalAccount.name, username: msalAccount.username}
}

export const User: FC<IUserProps> = (props)=>{    
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


