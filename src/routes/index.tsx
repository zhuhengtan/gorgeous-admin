import React from 'react'
import { SecurityScanOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router'
import { RouteConfig } from 'react-router-config'

import Layout from '@/components/layout'
import SecondLayout from '@/components/layout/second-layout'
import AccessDeny from '@/pages/access-deny'
import Roles from '@/pages/auth/role'
import Admins from '@/pages/auth/admin'
import Pages from '@/pages/auth/page'
import Login from '@/pages/login'
import NotFound from '@/pages/not-found'
import AdminInfo from '@/pages/admin-info'
import GenerateServerCrud from '@/pages/auth/generate-server-crud'

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
        render: () => <Redirect to="/admin-info" />,
      },
      {
        path: '/admin-info',
        exact: true,
        hidden: true,
        component: AdminInfo,
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
            path: '/auth/admin',
            name: 'Admin list',
            checkAuth: true,
            component: Admins,
          },
          {
            path: '/auth/generate-server-crud',
            name: 'Generate server crud',
            checkAuth: true,
            component: GenerateServerCrud,
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
