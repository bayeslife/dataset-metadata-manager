declare module 'ApplicationFrameRemote/Menu' {
  declare const Menu: FC<IMenuProps>
  export default Menu
}

declare module 'ApplicationFrameRemote/Token' {
  declare const Token: FC<ITokenComponentProps>
  export default Token
}

declare module 'ApplicationFrameRemote/ConfigData' {
  declare const ConfigData: FC<IConfigDataComponentProps>
  export default ConfigData

  export interface IConfigDataComponentProps {
    setConfig: (config: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
    getApplicationConfig: () => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
