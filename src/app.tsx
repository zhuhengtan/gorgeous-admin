import { useLocalStorageState } from 'ahooks'
import {
  ConfigProvider,
} from 'antd'
import React, { Suspense } from 'react'

import useGetAuthRoutes from '@/routes/auth-routes'

import {
  AuthProvider,
  useAllAuth,
} from '@joyu/auth/dist/esm/context/auth-context-provider'
import {
  AuthedProjectsProvider,
  useProjects,
} from '@joyu/auth/dist/esm/context/authed-projects-context-provider'
import { UserInfoProvider } from '@joyu/auth'
import { LoadingOutlined } from '@ant-design/icons'
import { languageMap } from './utils'
import theme from '../theme/default.json'
import './lang/i18n'

function AuthedRoutes() {
  const { authRoutes } = useGetAuthRoutes()

  return (
    <Suspense fallback={<>...</>}>
      {authRoutes}
    </Suspense>
  )
}

function AuthedProject() {
  const { localSelectedProject } = useProjects()
  return (
    <>
      {localSelectedProject.code && (
        <AuthProvider>
          <AuthedRoutes />
        </AuthProvider>
      )}
      {!localSelectedProject.code && (
        <div style={{ fontSize: 80 }}>
          <LoadingOutlined />
        </div>
      )}
    </>
  )
}

function App() {
  const [language] = useLocalStorageState('LANGUAGE', {
    defaultValue: 'zh',
  })

  return (
    // 默认使用中文包，需要切换国际化时请自行配置
    <ConfigProvider locale={(languageMap as any)[language as string].antd} theme={theme}>
      <UserInfoProvider
        env={import.meta.env.VITE_APP_ENV}
        appCode="joycs"
      >
        <AuthedProjectsProvider
          defaultProjectCode="default"
        >
          <AuthedProject />
        </AuthedProjectsProvider>
      </UserInfoProvider>
    </ConfigProvider>
  )
}

export default App
