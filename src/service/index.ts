import { AxiosRequestConfig } from 'axios'

import apiList from './api'
import axios from './axios'
import {
  ParamsArray, QueryData, QueryMethod, QueryParams,
} from './type'

// 不放在type.ts中防止循环引用
export type APIFunctionType = {
  [K in keyof typeof apiList]: (
    data?: any,
    options?: AxiosRequestConfig,
    cacheData?: boolean
  ) => any
}
const gen = (params: string) => {
  let url: string = params
  let method: QueryMethod = 'GET'

  const paramsArray = params.split(' ') as ParamsArray
  if (paramsArray.length === 2) {
    [method, url] = paramsArray
  }

  return (data?: QueryData, options?: AxiosRequestConfig) => {
    const queryParams: QueryParams = {
      url,
      method,
      [method === 'GET' ? 'params' : 'data']: data,
    }

    Object.assign(queryParams, options || {})

    return new Promise((resolve, reject) => {
      axios(queryParams)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
const APIFunction: APIFunctionType = {} as APIFunctionType

Reflect.ownKeys(apiList).forEach((key) => {
  APIFunction[key as keyof APIFunctionType] = gen(
    apiList[key as keyof APIFunctionType],
  )
})

export default APIFunction
