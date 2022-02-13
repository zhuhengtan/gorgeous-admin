import { useRequest, useLocalStorageState } from 'ahooks'

import { Form } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { getHrefParam, isMobile } from '@/utils'
import { setCookie } from '@/utils/cookie'
import api from '@/service'

import Mobile from './mobile'
import PC from './pc'

const { login: loginRequest, loginByLark: loginByLarkRequest } = api

const LoginComponent = isMobile() ? Mobile : PC

function Login() {
  const history = useHistory()
  const [form] = Form.useForm()
  const params = getHrefParam()
  const [, setToken] = useLocalStorageState('TOKEN', '')
  const [, setUserInfo] = useLocalStorageState('USER_INFO', {})

  const loginSuccess = useCallback(
    (loginRes) => {
      setCookie('token', loginRes.token)
      setToken(loginRes.token)
      setUserInfo(loginRes.user_info)
      if (params.redirect) {
        history.push(params.redirect as string)
      } else {
        history.push('/')
      }
    },
    [history, params.redirect, setToken, setUserInfo]
  )

  const { run: login, loading: loginLoading } = useRequest(
    (data) => loginRequest(data),
    {
      manual: true,
      onSuccess(e) {
        loginSuccess(e)
      },
    }
  )

  const { run: loginByLark, loading: larkLoginLoading } = useRequest(
    (data) => loginByLarkRequest(data),
    {
      manual: true,
      onSuccess(e) {
        loginSuccess(e)
      },
    }
  )

  const keyDownHandle = useCallback(
    async (e) => {
      const data = form.getFieldsValue()
      if (e.keyCode === 13) {
        // 按下回车键
        await login(data)
      }
    },
    [form, login]
  )
  const handlelogin = useCallback(async () => {
    const data = form.getFieldsValue()
    await login(data)
  }, [form, login])

  const onClickLarkLogin = useCallback(() => {
    window.location.assign(
      `https://open.feishu.cn/connect/qrconnect/page/sso/?redirect_uri=${encodeURIComponent(
        window.location.origin + window.location.pathname
      )}&app_id=${process.env.REACT_APP_FEISHU_APP_ID}`
    )
  }, [])

  useEffect(() => {
    if (params.from === 'feishu') {
      if (localStorage.getItem('token')) {
        if (isMobile()) {
          history.push('/dashboard/mobile')
        } else {
          history.push('/feedbacks/dashboard')
        }
      } else {
        onClickLarkLogin()
      }
    }
  }, [history, onClickLarkLogin, params.from])

  useEffect(() => {
    const larkLogin = () => {
      loginByLark({ code: String(params.code) })
    }
    if (params.code) {
      larkLogin()
    }
  }, [loginByLark, params.code])

  return (
    <LoginComponent
      loading={loginLoading || larkLoginLoading}
      form={form}
      keyDownHandle={keyDownHandle}
      handlelogin={handlelogin}
      onClickLarkLogin={onClickLarkLogin}
    />
  )
}
export default React.memo(Login)
