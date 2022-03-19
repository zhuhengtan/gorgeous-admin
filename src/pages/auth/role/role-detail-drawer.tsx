import { useRequest } from 'ahooks'
import {
  Button, Drawer, Form, Input, Spin, Tabs, Tree,
} from 'antd'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/service'
import { Operation } from '../types'

const {
  getAllOperations: getAllOperationsRequest,
  getRoleDetail: getRoleDetailRequest,
  addRole: addRoleRequest,
  updateRole: updateRoleRequest,
} = api

interface Props {
  id?: number
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

interface Auth {
  id: number
  checked: boolean
  element_key: string
  module_name: string
  module_type: number
  page_name: string
  page_path: string
  page_type: number
  routers: string
}

interface RoleDetail {
  id: number
  name: string
  role_type: number
  description: string
  auth: Auth[]
  checkedNumberKeys?: number[]
}

const RoleDetailDrawer: React.FC<Props> = (props: Props) => {
  const {
    id, visible, setVisible, onSuccess,
  } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [role, setRoleDetail] = useState<RoleDetail | null>(null)
  const [operationList, setOperationList] = useState([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [selectedOperationIds, setSelecetedOperationIds] = useState<number[]>([])

  // 将角色权限转换成树结构
  function transformRoleAuthData(data: Auth[]) {
    const module: any = {}
    const page: any = {}
    const treeData: {
      title: string
      key: string
      type: number
      children: any[]
    }[] = []
    data.forEach((one) => {
      // 判断当前目录是否已经存在
      if (!Object.prototype.hasOwnProperty.call(module, one.module_name)) {
        module[one.module_name] = treeData.length
        page[one.module_name] = {}
        treeData.push({
          title: t(one.module_name),
          key: one.module_name,
          type: 1,
          children: [],
        })
      }
      const moduleIndex = String(module[one.module_name] || '')
      // 判断当前目前下的页面是否存在
      if (
        !Object.prototype.hasOwnProperty.call(
          page[one.module_name],
          one.page_name,
        )
      ) {
        page[one.module_name][one.page_name] = treeData[moduleIndex as any].children.length
        treeData[moduleIndex as any].children.push({
          title: t(one.page_name),
          key: one.element_key ? `${one.module_name}|${one.page_name}` : one.id,
          type: 2,
          children: [],
          id: one.element_key ? undefined : one.id,
        })
      }
      if (one.element_key) {
        const pageIndex = page[one.module_name][one.page_name]
        treeData[moduleIndex as any].children[pageIndex].children.push({
          title: t(one.element_key),
          key: one.id,
          type: 3,
          id: one.id,
          children: [],
        })
      }
    })
    return treeData
  }

  function getCheckedRoleAuth(data: Auth[]): number[] {
    const numberKeys: number[] = []
    data.forEach((one) => {
      if (one.checked) {
        numberKeys.push(one.id)
      }
    })
    return numberKeys
  }

  const { run: getRoleDetail, loading: getDetailLoading } = useRequest(
    (roldId) => getRoleDetailRequest({ id: roldId }),
    {
      manual: true,
      onSuccess(e: any) {
        setRoleDetail(e)
        form.setFieldsValue({
          id: e.id,
          name: e.name,
          description: e.description,
        })
        const roleOperationIds = e.operations.map((operation: Operation) => `operation_${operation.id}`)
        setCheckedKeys(roleOperationIds)
        setSelecetedOperationIds(e.operations.map((operation: Operation) => operation.id))
      },
    },
  )

  const { run: getAllOperations, loading: getAuthLoading } = useRequest(
    () => getAllOperationsRequest(),
    {
      manual: true,
      onSuccess(e: any) {
        setOperationList(e.map((page: { id: number, name: string, operations: { id: number, name: string }[] }) => ({
          id: `page_${page.id}`,
          name: page.name,
          operations: page.operations.map((operation: { id: number, name: string }) => ({
            id: `operation_${operation.id}`,
            name: operation.name,
          })),
        })))
        setSelecetedOperationIds([])
        form.setFieldsValue({
          name: '',
          description: '',
        })
      },
    },
  )

  const { run: updateRole, loading: updateLoading } = useRequest(
    (data) => updateRoleRequest(data),
    {
      manual: true,
      onSuccess() {
        if (onSuccess) {
          onSuccess()
        }
      },
    },
  )

  const { run: addRole, loading: addLoading } = useRequest(
    (data) => addRoleRequest(data),
    {
      manual: true,
      onSuccess() {
        if (onSuccess) {
          onSuccess()
        }
      },
    },
  )

  const onClickSubmit = useCallback(async () => {
    const values = await form.validateFields()
    if (id) {
      // 更新
      updateRole({
        id,
        name: values.name,
        description: values.description,
        operationIds: selectedOperationIds,
      })
    } else {
      // 新增
      addRole({
        name: values.name,
        description: values.description,
        operationIds: selectedOperationIds,
      })
    }
  }, [addRole, form, id, selectedOperationIds, updateRole])

  const onCheck = useCallback(
    (
      value: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] },
      info: any,
    ) => {
      setCheckedKeys(value as React.Key[])
      const tmp: number[] = []
      info.checkedNodes.forEach((item: any) => {
        if (item.id) {
          tmp.push(item.id.split('_')[1])
        }
      })
      setSelecetedOperationIds(tmp)
    },
    [],
  )

  useEffect(() => {
    if (visible) {
      getAllOperations()
      if (id) {
        getRoleDetail(id)
      } else {
        setRoleDetail(null)
      }
    }
  }, [getAllOperations, getRoleDetail, id, visible])

  return (
    <Drawer
      title={id ? t('Edit role') : t('Add role')}
      visible={visible}
      placement="right"
      width={600}
      onClose={() => setVisible(false)}
      footer={(
        <Button
          type="primary"
          size="small"
          loading={addLoading || updateLoading}
          onClick={onClickSubmit}
        >
          {t('Submit')}
        </Button>
      )}
    >
      <Spin spinning={getDetailLoading || getAuthLoading}>
        <Form
          form={form}
          name="advanced_search"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="name"
            label={t('Role name')}
            rules={[{ required: true, message: t('Please input role name') }]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item name="description" label={t('Description')}>
            <Input></Input>
          </Form.Item>
        </Form>

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={t('Basic permission')} key="1">
            {((role && role.auth && role.auth.length > 0)
              || operationList.length > 0) && (
                <Tree
                  checkable
                  fieldNames={{ title: 'name', key: 'id', children: 'operations' }}
                  onCheck={onCheck}
                  defaultExpandAll
                  checkedKeys={checkedKeys}
                  treeData={(role && (role.auth as any)) || operationList}
                />
            )}
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </Drawer>
  )
}

RoleDetailDrawer.defaultProps = {
  id: 0,
}

export default React.memo(RoleDetailDrawer)
