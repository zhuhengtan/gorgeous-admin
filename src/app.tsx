import './lang/i18n'
import React from 'react'
import { useLocalStorageState } from 'ahooks'
import {
  ConfigProvider,
} from 'antd'

import useGetAuthRoutes from '@/routes/auth-routes'

import { Routes } from 'react-router'
import theme from '../theme/default.json'
import { languageMap } from './utils'

function App() {
  const [language] = useLocalStorageState('LANGUAGE', {
    defaultValue: 'zh',
  })

  const { authRoutes } = useGetAuthRoutes()

  return (
    // 默认使用中文包，需要切换国际化时请自行配置
    <ConfigProvider locale={(languageMap as any)[language as string].antd} theme={theme}>
      {authRoutes}
    </ConfigProvider>
  )
}

export default App
