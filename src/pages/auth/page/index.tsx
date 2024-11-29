import React, { useEffect } from 'react'
import AuthManagement from '@joyu/auth/dist/esm/components/auth-management'
import localRoutes from '@/routes'
import { useRequest } from 'ahooks'
import APIFunction from '@/service'
import { QueryMethod, RouteObject } from '@joyu/auth/dist/esm/type'

const Management: React.FC = () => {
  const {
    run: getAllApis,
    loading,
    data: apiList,
  } = useRequest<{ list: { name: string; method: QueryMethod; path: string }[] }, any>(
    () => APIFunction.getAllApisRequest(),
    {
      manual: true,
    },
  )

  useEffect(() => {
    getAllApis()
  }, [getAllApis])

  return (
    <AuthManagement
      appCode="joycs"
      env={import.meta.env.VITE_APP_ENV}
      routes={localRoutes as RouteObject[]}
      allApis={apiList?.list || []}
    />
  )
}

export default React.memo(Management)
