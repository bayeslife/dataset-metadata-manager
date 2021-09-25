import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';

export const ProjectSelect = ()=>{

    const [projects, projectsSet] = React.useState<string[]>([]);
    const [customers, customersSet] = React.useState<string[]>([]);

    const projectsData = ["Project1","Project2"]
    const customersData = ["Customer1","Customer2"]

    const handleProjectChange = (event: any) => {
        projectsSet(event.target.value as string[]);
      };
    const handleCustomerChange = (event: any) => {
      customersSet(event.target.value as string[]);
    };

      const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


    return <Grid container spacing={3}>
              <Grid item xs={4}> 
                  <FormControl>
                    <InputLabel id="project-select-label">Projects</InputLabel>
                    <Select
                      labelId="project-select-label"
                      id="project-select"
                      multiple
                      value={projects}
                      onChange={handleProjectChange}
                      input={<Input id="select-multiple-chip" />}
                      renderValue={(selected) => (
                        <div>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </div>
                      )}
                      MenuProps={MenuProps}
                    >
                      {projectsData.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>  
                  <FormControl>
                    <InputLabel id="customer-select-label">Customer</InputLabel>
                    <Select
                      labelId="customer-select-label"
                      id="customer-select"
                      multiple
                      value={customers}
                      onChange={handleCustomerChange}
                      input={<Input id="select-multiple-chip" />}
                      renderValue={(selected) => (
                        <div>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </div>
                      )}
                      MenuProps={MenuProps}
                    >
                      {customersData.map((customer) => (
                        <MenuItem key={customer} value={customer}>
                          {customer}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>       
            </Grid>
      

}


