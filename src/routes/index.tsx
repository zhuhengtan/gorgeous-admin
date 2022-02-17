import React from 'react'
import { SecurityScanOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router'
import { RouteConfig } from 'react-router-config'

import Layout from '@/components/layout'
import SecondLayout from '@/components/layout/second-layout'
import AccessDeny from '@/pages/access-deny'
import Roles from '@/pages/auth/role'
import Users from '@/pages/auth/user'
import Pages from '@/pages/auth/page'
import Login from '@/pages/login'
import NotFound from '@/pages/not-found'
import UserInfo from '@/pages/user-info'

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    routes: [
      {
        path: '/',
        exact: true,
        hidden: true,
        render: () => <Redirect to="/user-info" />,
      },
      {
        path: '/user-info',
        exact: true,
        hidden: true,
        component: UserInfo,
      },
      {
        path: '/auth',
        name: 'Auth management',
        icon: <SecurityScanOutlined />,
        component: SecondLayout,
        routes: [
          {
            path: '/auth/page',
            name: 'Page list',
            checkAuth: true,
            component: Pages,
          },
          {
            path: '/auth/role',
            name: 'Role list',
            checkAuth: true,
            component: Roles,
          },
          {
            path: '/auth/user',
            name: 'User list',
            checkAuth: true,
            component: Users,
          },
        ],
      },
      {
        path: '/access-deny',
        exact: true,
        hidden: true,
        component: AccessDeny,
      },
    ],
  },
  {
    path: '/404',
    component: NotFound,
  },
]

export default routes
