import React, { FC, useState } from 'react'

export const Home: FC = () => {

  const [path,pathSet]= useState()

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

  return (
    <div className='pageContainer'>
      <div className='pageTitle'>
        <h1>Dataset MetaData Manager</h1></div>
      <div className='pageContent'>      
        <div >
          <pre id="file-path"></pre>    
        </div>
        <div>
            Project:<input type="text" id="project" name="project" value="my-project" onChange={handleProjectChange}/>
        </div>
        <div>
            Client:<input type="text" id="client" name="client" value="my-client" onChange={handleProjectChange}/>
        </div>
        <div>
            Site Location Latitude:<input type="text" id="latitude" name="latitude" value="0" onChange={handleProjectChange}/> Longitude:<input type="text" id="longitude" name="longitude" value="0" onChange={handleProjectChange}/>
        </div>
        <div>
            <button onClick={handleChooseFile}>Choose File</button>
        </div>
        <div>
            <button id="file-upload-button" onClick={handleUpload}>Upload</button>
        </div>
        <div>
            <pre id="progress"></pre>    
        </div>      
      </div>      
    </div>
  )
}
