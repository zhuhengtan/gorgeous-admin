/* eslint-disable no-continue */
import './index.less'
import 'antd/es/layout/style'

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useLocalStorageState, useRequest } from 'ahooks'

import {
  Breadcrumb,
  Layout, Menu,
  MenuProps,
  Space,
} from 'antd'
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, RouteObject, useNavigate } from 'react-router'
import { Outlet, Link } from 'react-router-dom'

import api from '@/service'
import { AdminAuthContext } from '@/context/AdminAuthContext'
import { AdminInfo } from '@/type'

import Avatar from './avatar'
import GlobalLan from './global-lan'
import Logo from './logo'

const { getAdminAuth: getAdminAuthRequest } = api

interface BreadcrumbItem {
  path: string
  name: string
  key: string
}

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const CustomLayout = () => {
  const { route, location } = useGetRoute()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useTranslation()
  const [adminAuth, setAdminAuth] = useState({})
  const [finalAuth, setAuth] = useLocalStorageState('AUTH', {})
  const [admin] = useLocalStorageState('USER_INFO')

  // 如果没有登录，跳转登录页
  const [token] = useLocalStorageState('TOKEN', {
    defaultValue: '',
  })
  useEffect(() => {
    if (!token && window.location.href.indexOf('login') < 0) {
      navigate('/login')
    }
  }, [navigate, token])

  // 处理进来时展开的菜单
  const locationStr = location?.pathname.toString() || ''
  let defaultSelectedKeys
  let defaultOpenKeys
  // 处理面包屑导航
  const breadcrumbList: Array<BreadcrumbItem> = []
  route.routes.forEach((firstGrade: RouteConfig) => {
    if (firstGrade.routes && firstGrade.routes.length) {
      firstGrade.routes.forEach((secondGrade: RouteConfig) => {
        const match = matchPath(locationStr, secondGrade.path as string)
        if (match) {
          const currentFirstPath = firstGrade.path
            ? firstGrade.path.toLocaleString()
            : ''
          const currentSecondPath = secondGrade.path
            ? secondGrade.path.toLocaleString()
            : ''
          defaultSelectedKeys = [
            locationStr === '/dashboard' ? '' : currentSecondPath,
          ]
          defaultOpenKeys = [
            locationStr === '/dashboard' ? '' : currentFirstPath,
          ]
          breadcrumbList.push({
            path: '',
            name: firstGrade.name,
            key: firstGrade.path?.toLocaleString || firstGrade.name,
          })
          breadcrumbList.push({
            path: currentSecondPath,
            name: secondGrade.name,
            key: currentSecondPath,
          })
        }
      })
    } else {
      const match = matchPath(locationStr, firstGrade.path as string)
      if (match) {
        const currentFirstPath = firstGrade.path
          ? firstGrade.path.toLocaleString()
          : ''
        defaultSelectedKeys = [currentFirstPath]
        defaultOpenKeys = [currentFirstPath]
        breadcrumbList.push({
          path: '',
          name: firstGrade.name,
          key: firstGrade.path?.toLocaleString || firstGrade.name,
        })
      }
    }
  })

  // 折叠展开方法
  const toggleCollapse = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  const goToPage = useCallback(
    (menu: RouteConfig) => {
      // const path = menu.path.toLocaleString();
      navigate(menu.path as any)
    },
    [navigate],
  )

  function renderMenuItem(originRoutes: RouteConfig[]) {
    return originRoutes
      .filter((item) => !item.hidden)
      .map((item) => {
        const { path, icon, name } = item
        const routes = (item.routes || []).filter((item2) => !item2.hidden)
        if (routes.length) {
          return (
            <SubMenu key={path as string} icon={icon} title={t(name)}>
              {renderMenuItem(routes)}
            </SubMenu>
          )
        }
        return (
          <Menu.Item
            key={path as string}
            onClick={() => {
              goToPage(item)
            }}
            title={t(name)}
            icon={icon}
          >
            {t(name)}
          </Menu.Item>
        )
      })
  }

  const { run: getAdminAuth } = useRequest(() => getAdminAuthRequest({ id: (admin as AdminInfo).id }), {
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

  // const filterRoutersByPermission = useCallback(
  //   (routers: RouteConfig[]) => {
  //     const arr: RouteConfig[] = []
  //     routers.some((router) => {
  //       const obj = { ...router }
  //       if (
  //         obj.checkAuth
  //         && Object.prototype.hasOwnProperty.call(adminAuth, obj.path as string)
  //       ) {
  //         arr.push(obj)
  //       }
  //       if (obj.routes && obj.routes.length) {
  //         const newRouters = filterRoutersByPermission(obj.routes)
  //         if (newRouters.length) {
  //           obj.routes = newRouters
  //           arr.push(obj)
  //           return true
  //         }
  //         return true
  //       }
  //       if (!obj.checkAuth) {
  //         arr.push(obj)
  //       }
  //       return false
  //     })
  //     return arr
  //   },
  //   [adminAuth],
  // )

  const routeItemsWithPermission = useMemo(() => {
    const filterRoutersByPermission = (routers: RouteConfig[]): MenuProps['items'] => {
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
        if (obj.routes && obj.routes.length) {
          const newRouters = filterRoutersByPermission(obj.routes)
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
    return filterRoutersByPermission(route.routes)
  }, [goToPage, route, adminAuth])

  return (
    <AdminAuthContext.Provider value={finalAuth as any}>
      <Layout className="layout-container">
        <Sider
          width={200}
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="side-bar"
        >
          <Logo collapsed={collapsed} />
          <Menu
            mode="inline"
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={defaultSelectedKeys}
            items={routeItemsWithPermission}
          />
        </Sider>
        <Layout className="right-container">
          <Header className="header">
            <div className="left">
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  onClick: toggleCollapse,
                },
              )}
              <Breadcrumb className="breadcrumb">
                {breadcrumbList.map((item: BreadcrumbItem) => {
                  if (typeof item === 'object') {
                    return (
                      <Breadcrumb.Item key={item.key}>
                        {item.path ? (
                          <Link to={item.path}>{t(item.name)}</Link>
                        ) : (
                          t(item.name)
                        )}
                      </Breadcrumb.Item>
                    )
                  }
                  return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                })}
              </Breadcrumb>
            </div>
            <Space direction="horizontal" align="center">
              <GlobalLan />
              <Avatar />
            </Space>
          </Header>
          <Content className="content">
            <Outlet />
          </Content>
          <div className="footer">{t('APP NAME')}</div>
        </Layout>
      </Layout>
    </AdminAuthContext.Provider>
  )
}
export default React.memo(CustomLayout)
