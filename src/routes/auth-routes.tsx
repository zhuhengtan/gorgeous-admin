/* eslint-disable no-continue */
import routes from '@/routes'
import { useNavigate, useRoutes, RouteObject } from 'react-router'

import {
  useMemo, useCallback,
} from 'react'
import { MenuProps } from 'antd'
import { useAllAuth } from '@/context/auth-context-provider'

export default function useGetAuthRoutes() {
  const navigate = useNavigate()
  const allAuth = useAllAuth()
  // 这里直接过滤掉没有权限的path
  const goToPage = useCallback(
    (menu: CustomRouteObject) => {
      // const path = menu.path.toLocaleString();
      navigate(menu.path as any)
    },
    [navigate],
  )

  const authedRoutes = useMemo<CustomRouteObject[]>(() => {
    if (Object.keys(allAuth).length <= 0) {
      return routes
    }
    const filterRoutersByPermission = (
      routers: CustomRouteObject[],
    ): CustomRouteObject[] => {
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
          if (
            obj.checkAuth
            && Object.prototype.hasOwnProperty.call(allAuth, obj.path as string)
          ) {
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
  }, [allAuth])

  const menuList = useMemo<MenuProps['items']>(() => {
    const formatMenus = (routers: CustomRouteObject[]): MenuProps['items'] => {
      const arr: MenuProps['items'] = []
      for (let i = 0; i < routers.length; i++) {
        const obj = { ...routers[i] }
        if (obj.hidden) {
          continue
        }
        if (obj.checkAuth) {
          if (Object.hasOwn(allAuth, obj.path as string)) {
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
  }, [goToPage, allAuth])

  const elements = useRoutes(authedRoutes as RouteObject[])

  return {
    authedRoutes,
    menuList,
    authRoutes: (
      elements
    ),
  }
}
