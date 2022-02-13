interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}
declare module '*.less'
declare module 'classnames'
declare module 'marked'
declare module '*.scss' {
  const content: any
  export default content
}

declare module '*.png' {
  const value: string
  export = value
}

declare module '*.jpg' {
  const value: string
  export = value
}

declare module '*.svg' {
  const content: any

  export default content
}

interface JsonObject {
  [key: string]: null | number | string | Array<JsonObject> | JsonObject
}

interface ReturnData {
  code: number
  current_time: number
  data: JsonObject | null
  message: string
}

interface UserInfo {
  id: number
  name: string
  email: string
  user_type: string
  avatar: string
  login_time: string
  status: number
  remark: string
  role_id: number
  role_name: string
  setting: string
  projects: null | number
}

interface Auth {
  checked: boolean
  element_key: string
  id: number
  module_name: string
  module_type: number
  page_name: string
  page_path: string
  page_type: number
  routers: string
}
