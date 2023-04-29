import React from 'react'
import { SecurityScanOutlined } from '@ant-design/icons'

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
import { t } from 'i18next'
import { Navigate } from 'react-router'
import { CustomRouteObject } from '@/type'

const routes: CustomRouteObject[] = [
  {
    path: '/login',
    hidden: true,
    element: <Login />,
  },
  {
    path: '/',
    hidden: true,
    element: <Navigate to="/admin-info" />,
  },
  {
    path: '/auth',
    name: t('Auth management'),
    icon: <SecurityScanOutlined />,
    element: <Layout />,
    children: [
      {
        path: '/auth/page',
        name: t('Page list'),
        checkAuth: true,
        element: <Pages />,
      },
      {
        path: '/auth/role',
        name: t('Role list'),
        checkAuth: true,
        element: <Roles />,
      },
      {
        path: '/auth/admin',
        name: t('Admin list'),
        checkAuth: true,
        element: <Admins />,
      },
      {
        path: '/auth/generate-server-crud',
        name: t('Generate server crud'),
        checkAuth: true,
        element: <GenerateServerCrud />,
      },
    ],
  },
  {
    path: '/404',
    hidden: true,
    element: <NotFound />,
  },
  // {
  //   path: '*',
  //   element: () => <Redirect to="/404" />,
  // },
]

export default routes
