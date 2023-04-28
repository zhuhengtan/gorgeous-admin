import React from 'react'
import { SecurityScanOutlined } from '@ant-design/icons'

import Layout from '@/components/layout'
// import SecondLayout from '@/components/layout/second-layout'
import AccessDeny from '@/pages/access-deny'
import Roles from '@/pages/auth/role'
import Admins from '@/pages/auth/admin'
import Pages from '@/pages/auth/page'
import Login from '@/pages/login'
import NotFound from '@/pages/not-found'
import AdminInfo from '@/pages/admin-info'
import GenerateServerCrud from '@/pages/auth/generate-server-crud'
import { t } from 'i18next'
import { Navigate, RouteObject } from 'react-router'

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        // hidden: true,
        element: <Navigate to="/admin-info" />,
      },
      {
        index: true,
        path: '/admin-info',
        // hidden: true,
        element: <AdminInfo />,
      },
      {
        path: '/auth',
        // name: t('Auth management'),
        // icon: <SecurityScanOutlined />,
        // element: <SecondLayout />,
        children: [
          {
            path: '/auth/page',
            // name: t('Page list'),
            // checkAuth: true,
            element: <Pages />,
          },
          {
            path: '/auth/role',
            // name: t('Role list'),
            // checkAuth: true,
            element: <Roles />,
          },
          {
            path: '/auth/admin',
            // name: t('Admin list'),
            // checkAuth: true,
            element: <Admins />,
          },
          {
            path: '/auth/generate-server-crud',
            // name: t('Generate server crud'),
            // checkAuth: true,
            element: <GenerateServerCrud />,
          },
        ],
      },
      {
        path: '/access-deny',
        // hidden: true,
        element: <AccessDeny />,
      },
    ],
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  // {
  //   path: '*',
  //   element: () => <Redirect to="/404" />,
  // },
]

export default routes
