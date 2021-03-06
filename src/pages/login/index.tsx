import { useRequest, useLocalStorageState } from 'ahooks'

import { Form } from 'antd'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import { getHrefParam, isMobile } from '@/utils'
import { setCookie } from '@/utils/cookie'
import api from '@/service'

import Mobile from './mobile'
import PC from './pc'

const { login: loginRequest } = api

const LoginComponent = isMobile() ? Mobile : PC

function Login() {
  const history = useHistory()
  const [form] = Form.useForm()
  const params = getHrefParam()
  const [, setToken] = useLocalStorageState('TOKEN', {
    defaultValue: '',
  })
  const [, setAdminInfo] = useLocalStorageState('USER_INFO', {})

  const loginSuccess = useCallback(
    (loginRes) => {
      setCookie('token', loginRes.token)
      setToken(loginRes.token)
      setAdminInfo(loginRes.admin)
      if (params.redirect) {
        history.push(params.redirect as string)
      } else {
        history.push('/')
      }
    },
    [history, params.redirect, setToken, setAdminInfo],
  )

  const { run: login, loading: loginLoading } = useRequest(
    (data) => loginRequest(data),
    {
      manual: true,
      onSuccess(e) {
        loginSuccess(e)
      },
    },
  )

  const keyDownHandle = useCallback(
    async (e) => {
      const data = form.getFieldsValue()
      if (e.keyCode === 13) {
        // 按下回车键
        await login(data)
      }
    },
    [form, login],
  )
  const handlelogin = useCallback(async () => {
    const data = form.getFieldsValue()
    await login(data)
  }, [form, login])

  return (
    <LoginComponent
      loading={loginLoading}
      form={form}
      keyDownHandle={keyDownHandle}
      handlelogin={handlelogin}
    />
  )
}
export default React.memo(Login)
