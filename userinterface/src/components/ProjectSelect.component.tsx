import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React from 'react';

export const ProjectSelect = ()=>{

    const [projects, projectsSet] = React.useState<string[]>([]);
    const [customers, customersSet] = React.useState<string[]>([]);

    const projectsData = ["Project1","Project2"]
    const customersData = ["Customer1","Customer2"]

    const handleProjectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        projectsSet(event.target.value as string[]);
      };
    const handleCustomerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
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


