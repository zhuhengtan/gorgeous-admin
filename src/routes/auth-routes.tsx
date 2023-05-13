/* eslint-disable no-continue */
import routes from '@/routes'
import { CustomRouteObject, AdminInfo } from '@/type'
import {
  useNavigate,
  useRoutes,
  RouteObject,
} from 'react-router'

import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react'
import { MenuProps } from 'antd'
import { useLocalStorageState, useRequest } from 'ahooks'
import api from '@/service'
import { AdminAuthContext } from '@/context/AdminAuthContext'

export default function useGetAuthRoutes() {
  const navigate = useNavigate()
  const [adminAuth, setAdminAuth] = useState({})
  const [finalAuth, setAuth] = useLocalStorageState('AUTH', {})
  // 如果没有登录，跳转登录页
  const [token] = useLocalStorageState('TOKEN', {
    defaultValue: '',
  })
  const [admin] = useLocalStorageState('USER_INFO')

  const { run: getAdminAuth } = useRequest(() => api.getAdminAuth({ id: (admin as AdminInfo).id }), {
    manual: true,
    onSuccess(e: any) {
      setAdminAuth(e.auth)
      setAuth(e.auth)
    },
  })

  useEffect(() => {
    if (token) {
      getAdminAuth()
    }
  }, [getAdminAuth, token])

  // 这里直接过滤掉没有权限的path
  const goToPage = useCallback(
    (menu: CustomRouteObject) => {
      // const path = menu.path.toLocaleString();
      navigate(menu.path as any)
    },
    [navigate],
  )

  const authedRoutes = useMemo<CustomRouteObject[]>(
    () => {
      const filterRoutersByPermission = (routers: CustomRouteObject[]): CustomRouteObject[] => {
        const arr: CustomRouteObject[] = []
        routers.forEach((router) => {
          const obj = { ...router }
          if (obj.children && obj.children.length) {
            const childRouters = filterRoutersByPermission(obj.children)
            if (childRouters.length) {
              obj.children = childRouters
              arr.push(obj)
            }
          } else {
            if (obj.checkAuth && Object.prototype.hasOwnProperty.call(adminAuth, obj.path as string)) {
              arr.push(obj)
            }
            if (!obj.checkAuth) {
              arr.push(obj)
            }
          }
        })
        return arr
      }
      return filterRoutersByPermission(routes)
    },
    [adminAuth],
  )

  const menuList = useMemo<MenuProps['items']>(() => {
    const formatMenus = (routers: CustomRouteObject[]): MenuProps['items'] => {
      const arr: MenuProps['items'] = []
      for (let i = 0; i < routers.length; i++) {
        const obj = { ...routers[i] }
        if (obj.hidden) {
          continue
        }
        if (obj.checkAuth) {
          if (Object.hasOwn(adminAuth, obj.path as string)) {
            arr.push({
              key: obj.path as string,
              icon: obj.icon,
              title: obj.name,
              label: obj.name,
              onClick: () => {
                goToPage(obj)
              },
            })
            continue
          }
          continue
        }
        if (obj.children && obj.children.length) {
          const newRouters = formatMenus(obj.children)
          if (newRouters && newRouters.length) {
            arr.push({
              key: obj.path as string,
              icon: obj.icon,
              title: obj.name,
              label: obj.name,
              children: newRouters,
            })
            continue
          }
          continue
        }
        arr.push({
          key: obj.path as string,
          icon: obj.icon,
          title: obj.name,
          label: obj.name,
          onClick: () => {
            goToPage(obj)
          },
        })
      }
      return arr
    }
    return formatMenus(routes)
  }, [goToPage, adminAuth])

  const elements = useRoutes(authedRoutes as RouteObject[])

  return {
    authedRoutes,
    menuList,
    authRoutes: (
      <AdminAuthContext.Provider value={finalAuth as any}>
        {elements}
      </AdminAuthContext.Provider>
    ),
  }
}
