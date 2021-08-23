import React, { Suspense, useState } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { Layout } from './layout'
import { Home } from './pages'
import { Upload } from './pages'
import { updateConfig } from './config'
import { Loader } from './components'
import { getApplicationConfig } from './contract/api'

import StyleLoader from 'StyleManagementRemote/StyleLoader'
import StyleSelect from 'StyleManagementRemote/StyleSelect'
import RemoteConfigData from 'ApplicationFrameRemote/ConfigData'

// eslint-disable-next-line
function App() {
  const [stylePath, stylePathSet] = useState('aurecon-designsystem.style.css')
  //const [styleUrl, styleUrlSet] = useState<string | null>('https://quartile-one.gitlab.io/projects/gpc/webapplication/capability-style-management/')
  const [styleUrl, styleUrlSet] = useState<string | null>('https://localhost:3011')

  const onSelect = (value: string) => {
    stylePathSet(value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setConfig = (config: any) => {
    if (!styleUrl) {
      styleUrlSet(config.style.endpoint)
    }
    updateConfig(config)
  }

  return (
    <Suspense fallback={<Loader />}>
      <RemoteConfigData setConfig={setConfig} getApplicationConfig={getApplicationConfig}>
        <StyleLoader stylePath={stylePath} styleUrl={styleUrl}>          
              <HashRouter hashType='slash'>
                <Layout>
                  <Switch>
                    <Route path='/style' render={() => <StyleSelect onSelect={onSelect} />} />                                        
                    <Route path='/upload' component={Upload} />
                    <Route path='/' component={Home} />
                  </Switch>
                </Layout>
              </HashRouter>                   
        </StyleLoader>
      </RemoteConfigData>
      <script src="renderer.js"></script>
    </Suspense>
  )
}

export default App
