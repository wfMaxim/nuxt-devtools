import type { ModuleOptions, NuxtDevToolsOptions } from './types'

export const ROUTE_PATH = '/__nuxt_devtools__'
export const ROUTE_ENTRY = `${ROUTE_PATH}/entry`
export const ROUTE_CLIENT = `${ROUTE_PATH}/client`
export const ROUTE_AUTH = `${ROUTE_PATH}/auth`
export const ROUTE_AUTH_VERIFY = `${ROUTE_PATH}/auth-verify`
export const ROUTE_ANALYZE = `${ROUTE_PATH}/analyze`
export const WS_EVENT_NAME = 'nuxt:devtools:rpc'

export const defaultOptions: ModuleOptions = {
  enabled: undefined, // determine multiple conditions
  componentInspector: true,
  viteInspect: true,
  vscode: {
    enabled: true,
    startOnBoot: false,
    port: 3080,
    reuseExistingServer: true,
  },
}

export const defaultTabOptions: NuxtDevToolsOptions = {
  behavior: {
    telemetry: null,
  },
  ui: {
    componentsView: 'list',
    componentsGraphShowNodeModules: false,
    componentsGraphShowGlobalComponents: true,
    componentsGraphShowPages: false,
    componentsGraphShowLayouts: false,
    componentsGraphShowWorkspace: true,
    interactionCloseOnOutsideClick: false,
    showExperimentalFeatures: false,
    showHelpButtons: true,
    showPanel: null,
    scale: 1,
    minimizePanelInactive: 5000,
    hiddenTabs: [],
    pinnedTabs: [],
    hiddenTabCategories: [],
    sidebarExpanded: false,
    sidebarScrollable: false,
  },
  serverRoutes: {
    selectedRoute: null,
    view: 'tree',
    inputDefaults: {
      query: [],
      body: [],
      headers: [],
    },
    sendFrom: 'app',
  },
  assets: {
    view: 'grid',
  },
}
