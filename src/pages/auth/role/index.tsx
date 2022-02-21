import { usePagination, useRequest } from 'ahooks'
import {
  Button, Popconfirm, Space, Table, Tag,
} from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AuthFragment from '@/components/auth-fragment'
import api from '@/service'

import RoleDetailDrawer from './role-detail-drawer'

const { getRoles: getRolesRequest, deleteRole: deleteRoleRequest } = api

interface Role {
  id: number
  name: string
  roleType: number
  description: string
}

const Roles: React.FC = () => {
  const { t } = useTranslation()
  const [roles, setRoles] = useState([])
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0)

  const { run: getRoles, loading: getLoading, pagination } = usePagination(
    ({ current, pageSize }) => getRolesRequest({ page: current, pageSize }),
    {
      manual: true,
      throttleWait: 500,
      onSuccess(e) {
        setRoles(e.list as any)
      },
    },
  )

  const { run: deleteRole } = useRequest((id) => deleteRoleRequest({ id }), {
    manual: true,
    onSuccess() {
      getRoles({ current: 1, pageSize: pagination.pageSize })
    },
  })

  // 获取角色权限信息
  const onClickEdit = useCallback((id) => {
    setDrawerVisible(true)
    setSelectedRoleId(id)
  }, [])

  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id',
    },
    {
      title: t('Role name'),
      dataIndex: 'name',
    },
    {
      title: t('Description'),
      dataIndex: 'description',
    },
    {
      title: t('Role type'),
      dataIndex: 'roleType',
      render: (text: string, record: Role) => (
        <Space size="middle">
          {record.roleType === 2 && <Tag color="blue">{t('Custom role')}</Tag>}
          {record.roleType === 1 && (
            <Tag color="success">{t('System role')}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('Operation'),
      dataIndex: 'operation',
      render: (text: string, record: Role) => (
        <Space size="middle">
          <AuthFragment authKey="delete" otherConditions={record.roleType !== 1}>
            <Popconfirm
              title={t('Are you sure to delete')}
              onConfirm={() => {
                deleteRole(record.id)
              }}
              okText={t('Confirm')}
              cancelText={t('Cancel')}
            >
              <Button type="primary" danger size="small">
                {t('Delete')}
              </Button>
            </Popconfirm>
          </AuthFragment>

          {/* {record.roleType !== 1 && (

          )} */}
          <AuthFragment authKey="edit">
            <Button
              type="dashed"
              size="small"
              onClick={() => {
                onClickEdit(record.id)
              }}
            >
              {t('Edit')}
            </Button>
          </AuthFragment>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    getRoles({ current: 1, pageSize: 10 })
  }, [getRoles])

  return (
    <div>
      <AuthFragment authKey="add">
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setSelectedRoleId(0)
            setDrawerVisible(true)
          }}
        >
          {t('Add role')}
        </Button>
      </AuthFragment>
      <AuthFragment authKey="view">
        <Table
          loading={getLoading}
          rowKey="id"
          dataSource={roles}
          columns={columns}
          pagination={false}
        >
        </Table>
      </AuthFragment>
      <RoleDetailDrawer
        visible={drawerVisible}
        id={selectedRoleId}
        setVisible={setDrawerVisible}
        onSuccess={() => getRoles({
          current: pagination.current,
          pageSize: pagination.pageSize,
        })}
      />
    </div>
  )
}

export default React.memo(Roles)
