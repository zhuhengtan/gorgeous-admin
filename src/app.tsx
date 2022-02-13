import './lang/i18n'

import { useLocalStorageState } from 'ahooks'
import { ConfigProvider } from 'antd'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import routes from '@/routes'
import { renderRoutes } from '@/routes/render-routes'

import { languageMap } from './utils'

function App() {
  const [language] = useLocalStorageState('LANGUAGE', {
    defaultValue: 'zh',
  })
  const [token] = useLocalStorageState('TOKEN', {
    defaultValue: '',
  })
  const history = useHistory()
  // 监听登录状态，退出登录或登录过期，只用清空cookie中和localStorage中的token即可
  useEffect(() => {
    if (!token && window.location.href.indexOf('login') < -1) {
      history.push('/login')
    }
  }, [history, token])

  return (
    // 默认使用中文包，需要切换国际化时请自行配置
    <ConfigProvider locale={(languageMap as any)[language].antd}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </ConfigProvider>
  )
}

export default App
