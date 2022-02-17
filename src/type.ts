export interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}

export interface JsonObject {
  [key: string]: null | number | string | Array<JsonObject> | JsonObject
}

export interface UserInfo {
  id: number
  name: string
  email: string
  userType: number
  avatar: string
  status: number
}
