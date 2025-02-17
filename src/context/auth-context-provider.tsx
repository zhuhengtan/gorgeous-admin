import React, { useContext, useEffect, useState } from 'react'

import APIFunction from '@/service'
import { useRequest } from 'ahooks'
import { useUserInfo } from './user-info-provider'

const AuthContext = React.createContext<{
  [path in string]: {
    operationKey: string;
    operationName: string;
    relatedApis: string[];
  }[]
}>({})

export const AuthContextProvider = ({ children }: {children: React.ReactNode}) => {
  const {token} = useUserInfo()

  const [allAuth, setAllAuth] = useState<{
    [path in string]: {
      operationKey: string;
      operationName: string;
      relatedApis: string[];
    }[]
  }>({})

  // 获取所有权限存入context
  const { run: getAdminAuth } = useRequest(
    () => APIFunction.getAdminAuth(),
    {
      cacheKey: 'USER_AUTH',
      manual: true,
      onSuccess(e: any) {
        setAllAuth(e.auth)
      },
    },
  )
  useEffect(() => {
    if (token) {
      getAdminAuth()
    }
  }, [getAdminAuth, token])

  return (
    <AuthContext.Provider value={allAuth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAllAuth = () => {
  const allAuth = useContext(AuthContext)
  return allAuth
}
