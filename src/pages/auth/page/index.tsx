import {
  Button, Space, Popconfirm, Tree, Drawer, Modal,
} from 'antd'
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import {
  LockOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import api from '@/service'
import { useRequest } from 'ahooks'
import Form, { useForm, FRProps } from 'form-render'
import { useTranslation } from 'react-i18next'
import { showMessage } from '@/utils'
import AuthFragment from '@/components/auth-fragment'
import localRoutes from '@/routes'
import { RouteConfig } from 'react-router-config'
import { v4 } from 'uuid'
import { cloneDeep } from 'lodash'
import OperationEdit from './operation'
import { Operation, Page, FieldItem } from '../types'

interface EditingRoute {
  id: string | number
  name: string
  path: string
  hidden: boolean
  checkAuth: boolean
  pageType: number
  operations: Operation[]
  content: FieldItem[] | null
}

interface CurrentOperation {
  type: number // 0 查看  1 更新  2 新增
  title: string
}

const {
  createPage: createPageRequest,
  updatePage: updatePageRequest,
  deletePage: deletePageRequest,
  getPageDetail: getPageDetailRequest,
} = api

const Pages: React.FC = () => {
  const { t } = useTranslation()
  const form = useForm()
  const [routes, setRoutes] = useState<RouteConfig[]>([])
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [selectedLocalRoute, setSelectedLocalRoute] = useState<RouteConfig | null>(null)
  const [editingRoute, setEditingRoute] = useState<EditingRoute>({
    id: '',
    name: '',
    path: '',
    hidden: false,
    checkAuth: false,
    pageType: 0,
    operations: [],
    content: null,
  })
  const [currentOperation, setCurrentOperation] = useState<CurrentOperation>({
    type: 0,
    title: '',
  })

  const {
    run: getPageDetail,
  } = useRequest((param) => getPageDetailRequest(param), {
    manual: true,
    onSuccess(res: Page) {
      if (res) {
        const tmp: EditingRoute = {
          id: res.id,
          name: res.name || selectedLocalRoute?.name || '',
          path: res.path || selectedLocalRoute?.path as string || '',
          hidden: selectedLocalRoute?.hidden || false,
          checkAuth: selectedLocalRoute?.checkAuth || false,
          pageType: selectedLocalRoute?.pageType || 0,
          operations: res.operations || [],
          content: res.content || null,
        }
        form.setValues(tmp)
        setEditingRoute(tmp)
        setCurrentOperation({
          type: 1,
          title: t('Edit page'),
        })
      } else {
        const newRoute: EditingRoute = {
          id: '',
          name: t(selectedLocalRoute?.name) || '',
          path: selectedLocalRoute?.path as string || '',
          hidden: selectedLocalRoute?.hidden || false,
          checkAuth: selectedLocalRoute?.checkAuth || false,
          pageType: selectedLocalRoute?.pageType || 0,
          operations: [{
            id: `tmp_${v4()}`,
            name: '查看',
            key: 'view',
            relatedApi: '',
          }],
          content: null,
        }
        form.setValues(newRoute)
        setEditingRoute(newRoute)
        setCurrentOperation({
          type: 2,
          title: t('Create page'),
        })
      }
      setDrawerVisible(true)
    },
  })

  const {
    run: updatePage,
    loading: updating,
  } = useRequest((data) => updatePageRequest(data), {
    manual: true,
    onSuccess() {
      showMessage(t('Update success'))
      setDrawerVisible(false)
    },
  })

  const addKey: any = useCallback((items: RouteConfig[], level: number) => {
    if (!items) {
      return []
    }
    return items.map((item: RouteConfig) => ({
      id: item.key || `tmp_${v4()}`,
      ...item,
      routes: addKey(item.children, level + 1),
      pageType: 0,
      title: (
        <Space>
          {item.icon ? item.icon : <div style={{ width: 14, height: 24 }}></div>}
          {item.path}
          {item.checkAuth && <LockOutlined />}
          {item.hidden && <EyeInvisibleOutlined />}
        </Space>
      ),
    }))
  }, [])

  const {
    run: createPage,
    loading: creating,
  } = useRequest((data) => createPageRequest(data), {
    manual: true,
    onSuccess(res) {
      showMessage(t('Create success'))
      setDrawerVisible(false)
    },
  })

  const {
    run: deletePage,
  } = useRequest((id) => deletePageRequest({ id }), {
    manual: true,
    onSuccess(e) {
      showMessage(t('Delete success'))
      setDrawerVisible(false)
    },
  })

  useEffect(() => {
    setRoutes(addKey(localRoutes, 1))
  }, [setRoutes, addKey])

  const onClickUpdate = useCallback(() => {
    const data = form.getValues()
    updatePage(data)
  }, [form, updatePage])

  const onClickCreate = useCallback(() => {
    const data = form.getValues()
    console.log(data)
    const tmp = { ...data }
    delete tmp.id
    createPage(tmp)
  }, [createPage, form])

  const onDeleteOperation = useCallback(() => {
    getPageDetail({ path: editingRoute?.path })
  }, [editingRoute, getPageDetail])

  const onDrop = useCallback((info: any) => {
    const dropId = info.node.id
    const dragId = info.dragNode.id
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const searchRoute = (routes: RouteConfig[], id: string, callback: (targetObject: RouteConfig, index: number, targetLocationRoutes: RouteConfig[]) => void) => {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].routes) {
          searchRoute(routes[i].routes as RouteConfig[], id, callback)
        }
        if (routes[i].id === id) {
          if (callback) {
            callback(routes[i], i, routes)
            return
          }
        }
      }
    }

    const tmpRoutes = cloneDeep(routes)

    // Find dragObject
    let dragObj: RouteConfig
    searchRoute(tmpRoutes, dragId, (targetObject, index, targetLocationRoutes) => {
      targetLocationRoutes.splice(index, 1)
      dragObj = targetObject
    })

    if (!info.dropToGap) {
      // Drop on the content
      searchRoute(tmpRoutes, dropId, (targetObject: RouteConfig) => {
        targetObject.routes = targetObject.routes || []
        // where to insert 示例添加到头部，可以是随意位置
        targetObject.routes.unshift(dragObj)
      })
    } else if (
      (info.node.props.routes || []).length > 0 // Has routes
      && info.node.props.expanded // Is expanded
      && dropPosition === 1 // On the bottom gap
    ) {
      searchRoute(tmpRoutes, dropId, (item: RouteConfig) => {
        item.routes = item.routes || []
        // where to insert 示例添加到头部，可以是随意位置
        item.routes.unshift(dragObj)
        // in previous version, we use item.routes.push(dragObj) to insert the
        // item to the tail of the routes
      })
    } else {
      let ar: any = []
      let i: number = 0
      searchRoute(tmpRoutes, dropId, (item: any, index: number, arr: any) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj!)
      } else {
        ar.splice(i + 1, 0, dragObj!)
      }
    }
    setRoutes(tmpRoutes)
  }, [routes])

  const schema = useMemo<FRProps['schema']>(() => ({
    type: 'object',
    properties: {
      id: {
        type: 'string',
        hidden: true,
      },
      name: {
        type: 'string',
        title: t('Page name'),
        placeholder: t('Please input page name'),
        disabled: true,
      },
      path: {
        type: 'string',
        title: t('Page path'),
        placeholder: t('Please input page path'),
        required: true,
        disabled: true,
      },
      hidden: {
        type: 'boolean',
        title: t('Page hidden'),
        default: false,
        disabled: true,
      },
      checkAuth: {
        type: 'boolean',
        title: t('Page check auth'),
        default: false,
        disabled: true,
      },
      pageType: {
        type: 'number',
        title: t('Page type'),
        enum: [0], // , 1, 2
        enumNames: [t('Page type hand-writing') as string, t('Page type configure') as string, t('Page type generate') as string],
        default: 0,
        widget: 'radio',
      },
      operations: {
        type: 'array',
        hidden: '{{ rootValue.pageType !== 0 || !rootValue.checkAuth }}',
        title: t('Page operations'),
        widget: 'operationEdit',
        props: {
          onDeleteOperation,
        },
      },
    },
  }), [t, onDeleteOperation])

  const onClickTreeNode = useCallback((selectedKeys: (string | number)[], e: any) => {
    const route: any = e.selectedNodes[0]
    setSelectedLocalRoute(route)
    if (route.checkAuth) { // 如果有checkAuth，看后台有没有存此页信息，没有则为新增
      getPageDetail({ path: route.path })
    } else {
      const tmp = {
        id: route.id,
        name: route.name || '',
        path: route.path,
        hidden: route.hidden || false,
        checkAuth: route.checkAuth || false,
        pageType: route.pageType || 0,
        operations: [],
        content: null,
      }
      setEditingRoute(tmp)
      form.setValues(tmp)
      setCurrentOperation({
        type: 0,
        title: t('View page'),
      })
      setDrawerVisible(true)
    }
  }, [form, getPageDetail, t])

  return (
    <>
      {routes && routes.length
        && (
          <Tree
            style={{ marginTop: 20 }}
            defaultExpandAll
            // draggable
            // blockNode
            // onDrop={onDrop}
            selectedKeys={[]}
            onSelect={onClickTreeNode}
            fieldNames={{ key: 'id', children: 'routes' }}
            treeData={routes as any}
          />
        )}
      <Drawer
        title={currentOperation.title}
        open={drawerVisible}
        width={800}
        onClose={() => setDrawerVisible(false)}
        extra={(
          <Space>
            {/* <AuthFragment authKey="delete">
              <Popconfirm
                title={t('Are you sure to delete')}
                onConfirm={() => {
                  deletePage(editingRoute.id)
                }}
                okText={t('Confirm')}
                cancelText={t('Cancel')}
              >
                <Button type="primary" danger>{t('Delete page')}</Button>
              </Popconfirm>
            </AuthFragment> */}
            <AuthFragment authKey="update" otherConditions={currentOperation.type === 1}>
              <Button onClick={onClickUpdate} loading={updating} type="primary">
                {t('Submit')}
              </Button>
            </AuthFragment>
            <AuthFragment authKey="create" otherConditions={currentOperation.type === 2}>
              <Button onClick={onClickCreate} loading={creating} type="primary">
                {t('Submit')}
              </Button>
            </AuthFragment>
          </Space>
        )}
      >
        <Form
          form={form}
          schema={schema}
          widgets={{
            operationEdit: OperationEdit,
          }}
        />
      </Drawer>
    </>
  )
}

export default React.memo(Pages)
