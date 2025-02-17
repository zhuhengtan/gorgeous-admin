import { useLocalStorageState } from 'ahooks'
import React, { useContext, useEffect, useMemo } from 'react'

const UserInfoContext = React.createContext<{
  token?: string,
  userInfo?: AdminInfo
}>({
  token: '',
  userInfo: undefined,
})

export const UserInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token] = useLocalStorageState('TOKEN', {
    defaultValue: '',
    listenStorageChange: true,
  })
  const [userInfo] = useLocalStorageState<AdminInfo>('USER_INFO')
  const value = useMemo(() => ({
    token,
    userInfo,
  }), [token, userInfo])

  useEffect(()=>{
    if(!token && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }, [token])

  return (
    <UserInfoContext.Provider
      value={value}
    >
      {children}
    </UserInfoContext.Provider>
  )
}

export const useUserInfo = () => {
  const { token, userInfo } = useContext(UserInfoContext)
  return { token, userInfo }
}
