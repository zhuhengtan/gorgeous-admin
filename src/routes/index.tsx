import React from 'react'
import { SecurityScanOutlined } from '@ant-design/icons'

import Layout from '@/components/layout'
import NotFound from '@/pages/not-found'
import AdminInfo from '@/pages/admin-info'
import { t } from 'i18next'
import { Navigate } from 'react-router'
import { CustomRouteObject } from '@/type'

const WorkOrder = React.lazy(() => import('@/pages/work-order'))
const Page = React.lazy(() => import('@/pages/auth/page'))

const routes: CustomRouteObject[] = [
  {
    path: '/',
    hidden: true,
    element: <Navigate to="/admin-info" />,
  },
  {
    path: '/admin-info',
    hidden: true,
    element: <Layout />,
    children: [
      {
        path: '/admin-info',
        name: t('Admin info'),
        checkAuth: false,
        element: <AdminInfo />,
      },
    ],
  },
  {
    path: '/work-order',
    element: <Layout />,
    children: [
      {
        path: '/work-order',
        name: t('Work order'),
        checkAuth: true,
        element: <WorkOrder />,
      },
    ],
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
        element: <Page />,
      },
    ],
  },
  {
    path: '/404',
    hidden: true,
    element: <NotFound />,
  },
  {
    path: '*',
    hidden: true,
    element: <Navigate to="/404" />,
  },
]

export default routes
