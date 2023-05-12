import './lang/i18n'

import { useLocalStorageState } from 'ahooks'
import { ConfigProvider } from 'antd'
import React, { useEffect } from 'react'
import {
  BrowserRouter as Router, useRoutes, useParams, RouteObject,
} from 'react-router-dom'
import routes from '@/routes'
import theme from './antd-theme.json'
import { languageMap } from './utils'

function GetRoutes() {
  const elements = useRoutes(routes as RouteObject[])

  return elements
}

function App() {
  const [language] = useLocalStorageState('LANGUAGE', {
    defaultValue: 'zh',
  })
  const [token] = useLocalStorageState('TOKEN', {
    defaultValue: '',
  })

  return (
    // 默认使用中文包，需要切换国际化时请自行配置
    <ConfigProvider locale={(languageMap as any)[language as string].antd} theme={theme}>
      <Router>
        <GetRoutes />
      </Router>
    </ConfigProvider>
  )
}

export default App
