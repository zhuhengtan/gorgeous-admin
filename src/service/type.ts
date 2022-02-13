export type QueryMethod = 'GET' | 'POST' | 'DELETE' | 'PUT'
export type ParamsArray = [QueryMethod, string] | [string]
export interface QueryData {
  [key: string]: unknown
}

interface GetParams {
  url: string
  method: QueryMethod
  params?: QueryData
}

interface OtherParams {
  url: string
  method: QueryMethod
  data?: QueryData
}

export type QueryParams = GetParams | OtherParams

export interface ApiList {
  [key: string]: string
}
