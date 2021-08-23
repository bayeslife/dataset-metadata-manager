import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import React, {FC} from 'react';

interface IDataSetTypeSelect {
  callback: (metadata:any)=>void
}

export const DataSetTypeSelection : FC<IDataSetTypeSelect> = (options: any)=>{

    const {callback} = options

    const [datasetType, datasetTypeSet] = React.useState<string>('');

    const datasetTypes = ["LessonsLearned","WholeOflife"]    

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const val :string = event.target.value as string
        datasetTypeSet(val);   
        callback({DatasetType: val})
        event.preventDefault();
      };
    
      return <Grid container spacing={3}>
                <Grid item xs={12}> 
                    <TextField fullWidth select  label="Data Set Type" value={datasetType} onChange={handleChange} >
                          {datasetTypes.map((name) => (
                                <MenuItem key={name} value={name}>
                                  {name}
                                </MenuItem>
                              ))}
                    </TextField>            
                  </Grid>                
            </Grid>
}


