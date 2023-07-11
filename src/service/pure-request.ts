import { AxiosRequestConfig } from 'axios'
import md5 from 'md5'
import {
  ParamsArray, QueryData, QueryMethod, QueryParams,
} from './type'
import axios from './axios'

export default function pureReqeust(api: string, data?: QueryData, options?: AxiosRequestConfig): Promise<unknown> {
  let url: string = ''
  let method: QueryMethod = 'GET'

  const paramsArray = api.split(' ') as ParamsArray
  if (paramsArray.length === 2) {
    [method, url] = paramsArray
  }
  if (!data) {
    data = {}
  }
  const timestamp = (new Date()).getTime()
  data.timestamp = timestamp
  data.sign = md5(`${Object.keys(data).filter((key) => (key !== 'timestamp' && key !== 'sign')).map((key) => JSON.stringify((data as QueryData)[key])).join('')}${timestamp}${process.env.REACT_APP_SIGN_KEY}`).toUpperCase()

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
