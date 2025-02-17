import './lang/i18n'
import React from 'react'
import { useLocalStorageState } from 'ahooks'
import {
  ConfigProvider,
} from 'antd'

import useGetAuthRoutes from '@/routes/auth-routes'

import theme from '../theme/default.json'
import { languageMap } from './utils'
import { UserInfoProvider, useUserInfo } from './context/user-info-provider'
import { AuthContextProvider, useAllAuth } from './context/auth-context-provider'
import { Route, Routes } from 'react-router'
import Login from './pages/login'

function AuthedRoutes() {
  const allAuth = useAllAuth()
  const { authRoutes } = useGetAuthRoutes()
  if(Object.keys(allAuth).length === 0) {
    return <>...</>
  }
  return authRoutes
}

function AllAuth() {
  const {token} = useUserInfo()
  if(!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    )
  }
  return (
    <AuthContextProvider>
      <AuthedRoutes />
    </AuthContextProvider>
  )
}

function App() {
  const [language] = useLocalStorageState('LANGUAGE', {
    defaultValue: 'zh',
  })

  return (
    // 默认使用中文包，需要切换国际化时请自行配置
    <ConfigProvider locale={(languageMap as any)[language as string].antd} theme={theme}>
      <UserInfoProvider>
        <AllAuth />
      </UserInfoProvider>
    </ConfigProvider>
  )
}

export default App
