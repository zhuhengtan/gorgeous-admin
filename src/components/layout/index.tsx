import './index.less'
import 'antd/es/layout/style'

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useLocalStorageState, useRequest } from 'ahooks'

import {
  Breadcrumb,
  Layout, Menu,
  Space,
} from 'antd'
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  matchPath, useLocation, useNavigate,
} from 'react-router'
import { Outlet, Link } from 'react-router-dom'
import allRoutes from '@/routes'

import api from '@/service'

import { CustomRouteObject } from '@/type'

import useGetAuthRoutes from '@/routes/auth-routes'
import Avatar from './avatar'
import GlobalLan from './global-lan'
import Logo from './logo'

interface BreadcrumbItem {
  path: string
  name: string
  key: string
}

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const CustomLayout = () => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useTranslation()

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
  const locationStr = useLocation().pathname
  let defaultSelectedKeys
  let defaultOpenKeys
  // 处理面包屑导航
  const breadcrumbList: Array<BreadcrumbItem> = []
  allRoutes.forEach((firstGrade: CustomRouteObject) => {
    if (firstGrade.children && firstGrade.children.length) {
      firstGrade.children.forEach((secondGrade: CustomRouteObject) => {
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
          if (firstGrade.name && firstGrade.path) {
            breadcrumbList.push({
              path: '',
              name: firstGrade.name,
              key: firstGrade.path || firstGrade.name,
            })
            if (secondGrade.name) {
              breadcrumbList.push({
                path: currentSecondPath,
                name: secondGrade.name,
                key: currentSecondPath,
              })
            }
          }
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
        if (firstGrade.name && firstGrade.path) {
          breadcrumbList.push({
            path: '',
            name: firstGrade.name,
            key: firstGrade.path || firstGrade.name,
          })
        }
      }
    }
  })

  // 折叠展开方法
  const toggleCollapse = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  const { menuList } = useGetAuthRoutes()

  return (
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
          items={menuList}
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
  )
}
export default React.memo(CustomLayout)
