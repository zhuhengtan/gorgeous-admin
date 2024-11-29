import axios, { AxiosInstance } from 'axios'

import { defaultGetErrorMsg, showError, showMessage } from '@/utils'
import { deleteCookie, getCookie } from '@/utils/cookie'

const CONFIG = {
  baseURL: import.meta.env.VITE_APP_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
}

const axiosInstance: AxiosInstance = axios.create(CONFIG)

axiosInstance.interceptors.request.use(
  (config) => {
    // 配置公共的请求部分逻辑
    if (!config.headers) {
      return config
    }
    let token = getCookie('token')
    if (!token) {
      token = localStorage.getItem('token') || ''
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.language = localStorage.getItem('i18nextLng') || 'zh'
    config.headers['content-type'] = 'application/json'
    return config
  },
  (error) => {
    throw error
  },
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 401) {
      deleteCookie('token')
      localStorage.clear()
      showError(res.message)
      (window?.microApp?.location || window.location).assign('/login')
    } else if (res.code !== 200) {
      if (res.code === 10404) {
        (window?.microApp?.location || window.location).assign('/access-deny')
      } else {
        showError(res.message)
        throw new Error(JSON.stringify(res))
      }
    } else if (response.config.method !== 'get') {
      showMessage(res.message)
    }
    return res.data
  },
  (error) => {
    showError(defaultGetErrorMsg(error))
    const { status } = error.response
    if (status === 401) {
      (window?.microApp?.location || window.location).assign('/login')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
