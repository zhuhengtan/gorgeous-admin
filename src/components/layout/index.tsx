/* eslint-disable no-continue */
import './index.less'
import 'antd/es/layout/style'

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useLocalStorageState, useRequest } from 'ahooks'

import { Breadcrumb, Layout, Menu, Space } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath } from 'react-router'
import { renderRoutes, RouteConfig } from 'react-router-config'
import { Link, useHistory } from 'react-router-dom'

import { UserAuthContext } from '@/context/UserAuthContext'
import api from '@/service'

import Avatar from './avatar'
import GlobalLan from './global-lan'
import Logo from './logo'

const { getUserAuth: getUserAuthRequest } = api

interface BreadcrumbItem {
  path: string
  name: string
  key: string
}

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const CustomLayout = (props: RouteConfig) => {
  const { route, location } = props
  const history = useHistory()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useTranslation()
  const [userAuth, setUserAuth] = useState([])
  const [finalAuth, setAuth] = useLocalStorageState('AUTH', {})

  // 如果没有登录，跳转登录页
  const [token] = useLocalStorageState('TOKEN', {
    defaultValue: ''
  })
  useEffect(() => {
    if (!token && window.location.href.indexOf('login') < 0) {
      history.push('/login')
    }
  }, [history, token])

  // 处理进来时展开的菜单
  const locationStr = location?.pathname.toString() || ''
  let defaultSelectedKeys
  let defaultOpenKeys
  // 处理面包屑导航
  const breadcrumbList: Array<BreadcrumbItem> = []
  route.routes.forEach((firstGrade: RouteConfig) => {
    if (firstGrade.routes && firstGrade.routes.length) {
      firstGrade.routes.forEach((secondGrade: RouteConfig) => {
        const match = matchPath(locationStr, {
          path: secondGrade.path,
          exact: true,
          strict: false,
        })
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
      const match = matchPath(locationStr, {
        path: firstGrade.path,
        exact: true,
        strict: false,
      })
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
    (menu) => {
      // const path = menu.path.toLocaleString();
      history.push(menu.path)
    },
    [history]
  )

  function renderMenuItem(originRoutes: RouteConfig[]) {
    return originRoutes
      .filter((item) => !item.hidden)
      .map((item) => {
        const { path, icon, name } = item
        const routes = (item.routes || []).filter((item2) => !item2.hidden)
        if (routes.length) {
          return (
            <SubMenu key={path?.toLocaleString()} icon={icon} title={t(name)}>
              {renderMenuItem(routes)}
            </SubMenu>
          )
        }
        return (
          <Menu.Item
            key={path?.toLocaleString()}
            onClick={() => {
              goToPage(route)
            }}
            title={t(name)}
            icon={icon}
          >
            {t(name)}
          </Menu.Item>
        )
      })
  }

  const { run: getUserAuth } = useRequest(() => getUserAuthRequest(), {
    manual: true,
    formatResult(e) {
      const obj = {}
      e.auth.forEach((auth: any) => {
        if (auth.checked) {
          if (!Object.prototype.hasOwnProperty.call(obj, auth.page_path)) {
            ;(obj as JsonObject)[auth.page_path] = []
          }
          if (auth.element_key) {
            ;((obj as JsonObject)[auth.page_path] as JsonObject[]).push(
              auth.element_key
            )
          }
        }
      })
      return obj
    },
    onSuccess(e) {
      setUserAuth(e)
      setAuth(e)
    },
  })

  // useEffect(() => {
  //   if (token) {
  //     getUserAuth()
  //   }
  // }, [getUserAuth, token])

  const filterRoutersByPermission = useCallback(
    (routers: RouteConfig[]) => {
      const arr = []
      for (let i = 0; i < routers.length; i++) {
        const obj = { ...routers[i] }
        if (
          obj.checkAuth &&
          Object.prototype.hasOwnProperty.call(userAuth, obj.path as string)
        ) {
          arr.push(obj)
        }
        if (obj.routes && obj.routes.length) {
          const newRouters = filterRoutersByPermission(obj.routes)
          if (newRouters.length) {
            obj.routes = newRouters
            arr.push(obj)
            continue
          }
          continue
        }
        arr.push(obj)
      }
      return arr
    },
    [userAuth]
  )

  return (
    <UserAuthContext.Provider value={finalAuth}>
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
          >
            {renderMenuItem(filterRoutersByPermission(route.routes))}
          </Menu>
        </Sider>
        <Layout className="right-container">
          <Header className="header">
            <div className="left">
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  onClick: toggleCollapse,
                }
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
          <Content className="content">{renderRoutes(route.routes)}</Content>
          <div className="footer">{t('APP NAME')}</div>
        </Layout>
      </Layout>
    </UserAuthContext.Provider>
  )
}
export default React.memo(CustomLayout)
