import React, { FC, useState } from 'react'

import Background from '../assets/data-collection.jpg'
import Logo from '../assets/logo.png'

export const Home: FC = () => {

  const backgroundImage = Background

  return (
      <div>
        <div className='login-page' style={{ backgroundImage: `url(${backgroundImage})` }}>
         <div className='login-gradient' />
        <div className='login-container'>
          <div className='login-header'>
                <img src={Logo} alt='' width='300px'  />
          </div>
          <div className='login-content'>
            <h2>Welcome to the Data Collector </h2>
            <p>
              This Aurecon application provides capabilities upload data set files.
              </p>   
              <p>
              Users select files, provide meta data and submit data sets.
              </p>
        
          <div className='login-content' />
        </div>      
      </div>
      </div>
      </div>      
  )
}