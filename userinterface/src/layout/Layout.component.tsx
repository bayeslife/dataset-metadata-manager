import React from 'react'
import { getMSALConfiguration } from '../config'
import RemoteMenu from 'ApplicationFrameRemote/Menu'
import RemoteToken from 'ApplicationFrameRemote/Token'
import RemoteJobNotifier from 'DataRoutingRemote/JobNotifier'

export interface IMenuLink {
  path: string
  label: string
  match?: RegExp
}

export interface IMenuAction {
  icon?: string
  label?: string
  size?: 'small' | 'large' | 'extra small' | 'medium'
  isActive?: boolean
  click?: () => void
}

export interface IMenuProps {
  children?: React.ReactNode
  logo?: JSX.Element
  links: IMenuLink[]
  actions: IMenuAction[]
}

export interface IMSALConfiguration {
  clientId: string
  tenantId: string
  scopes: string[]
  redirectUri: string
}

declare interface ITokenComponentProps {
  config: IMSALConfiguration
}

import AureconLogo from '../assets/logo.png'

// eslint-disable-next-line
export const Layout = (props: any): JSX.Element => {
  const Logo = <img src={AureconLogo}></img>

  const handleNavbarClick = (url: string, hash: boolean) => {
    if (hash) window.location.hash = url
    //else openInNewTab(url)
  }

  const links: IMenuLink[] = []
  links.push({ label: 'Upload', path: '/Upload', match: /^\/upload/ })
  links.push({ label: 'History', path: '/History', match: /^\/history/ })
  links.push({ label: 'DataSets', path: '/DataSets', match: /^\/datasets/ })

  const actions: IMenuAction[] = []
  actions.push({
    icon: 'settings',
    size: 'large',
    click: () => handleNavbarClick('/settings', true),
  })
  actions.push({
    icon: 'account_circle',
    size: 'large',
    click: () => handleNavbarClick('/profile', true),
  })

  const msalConfig = getMSALConfiguration()

  return (
    <div className='layoutContainer'>
      <RemoteJobNotifier/>
      <RemoteMenu logo={Logo} links={links} actions={actions}>
        <RemoteToken config={msalConfig} cssClass={'button is-small is-text is-navbar'} />
      </RemoteMenu>
      {props.children}
    </div>
  )
}
