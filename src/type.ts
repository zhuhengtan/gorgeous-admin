import React from 'react'
import { RouteObject } from 'react-router'

export interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
}

export interface JsonObject {
  [key: string]: null | number | string | Array<JsonObject> | JsonObject
}

export type CustomRouteObject = Omit<RouteObject, 'children'> & {
  hidden?: boolean
  name?: string
  icon?: React.ReactNode
  checkAuth?: boolean
  children?: CustomRouteObject[]
}

export interface AdminInfo {
  id: number
  name: string
  email: string
  adminType: number
  avatar: string
  status: number
}
