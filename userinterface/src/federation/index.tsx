import React, { FC } from 'react'

//These are helper  function from the webpack federation documentation/samples
//https://github.com/module-federation/module-federation-examples/tree/master/dynamic-system-host

// eslint-disable-next-line
export function loadComponent(scope: string, module: string) {
  // eslint-disable-next-line
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes

    // eslint-disable-next-line
    // @ts-ignore
    await __webpack_init_sharing__('default')

    // eslint-disable-next-line
    // @ts-ignore
    const container = window[scope] // or get the container somewhere else
    // Initialize the container, it may provide shared modules

    // eslint-disable-next-line
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default)

    // eslint-disable-next-line
    // @ts-ignore
    const factory = await window[scope].get(module)
    const Module = factory()

    return Module
  }
}

// eslint-disable-next-line
export const useDynamicScript = (args: any) => {
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    if (!args.url) {
      return
    }

    const element = document.createElement('script')

    element.src = args.url
    element.type = 'text/javascript'
    element.async = true

    setReady(false)
    setFailed(false)

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`)
      setReady(true)
    }

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`)
      setReady(false)
      setFailed(true)
    }

    document.head.appendChild(element)

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`)
      document.head.removeChild(element)
    }
  }, [args.url])

  return {
    ready,
    failed,
  }
}

interface IFederatedComponentProps {
  style: { [classname: string]: string }
}

export type FederatedComponent = FC<IFederatedComponentProps>
