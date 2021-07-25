import { IMSALConfiguration } from '../layout/Layout.component'

const location = window.location.origin

export function getAPIDomain(): string {
  const developmentDomain = window.localStorage.getItem('Capability:ProjectAPIDomain')
  if (developmentDomain) return developmentDomain
  if (location.indexOf('localhost') >= 0) return 'http://localhost:7075'
  else {
    return process.env.API_DOMAIN || 'please define API_DOMAIN'
  }
}

export function getAPI(): string {
  const domain = getAPIDomain()
  return `${domain}/api`
}

let msalConfig: IMSALConfiguration = {
  clientId: '',
  tenantId: '',
  scopes: [''],
  redirectUri: '',
}

// eslint-disable-next-line
export function updateConfig(config: any) {
  msalConfig = config.authentication
}

export function getMSALConfiguration(): IMSALConfiguration {
  return msalConfig
}
