import React, { Suspense, useState } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { Layout } from './layout'
import { Home } from './pages'
import { updateConfig } from './config'
import { Loader } from './components'
import { getApplicationConfig } from './contract/api'

import StyleLoader from 'StyleManagementRemote/StyleLoader'
import StyleSelect from 'StyleManagementRemote/StyleSelect'
import RemoteConfigData from 'ApplicationFrameRemote/ConfigData'

// eslint-disable-next-line
function App() {
  const [stylePath, stylePathSet] = useState('gladstoneport-model.style.css')
  const [styleUrl, styleUrlSet] = useState<string | null>('https://style-dev.azureedge.net')

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
                    <Route path='/' exact component={Home} />
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
