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
  role_type: number
}

const Roles: React.FC = () => {
  const { t } = useTranslation()
  const [roles, setRoles] = useState({
    list: [],
    total: 0,
  })
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0)

  const { run: getRoles, loading: getLoading, pagination } = usePagination(
    ({ current, pageSize }) => getRolesRequest({ current_page: current, page_size: pageSize }),
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
      dataIndex: 'role_type',
      render: (text: string, record: Role) => (
        <Space size="middle">
          {record.role_type === 2 && <Tag color="blue">{t('Custom role')}</Tag>}
          {record.role_type === 1 && (
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
          {record.role_type !== 1 && (
            <Popconfirm
              title={t('Are you sure to delete')}
              onConfirm={() => {
                deleteRole(record.id)
              }}
              okText={t('Confirm')}
              cancelText={t('Cancel')}
            >
              <Button type="primary" size="small">
                {t('Delete')}
              </Button>
            </Popconfirm>
          )}

          {record.role_type !== 1 && (
            <Button
              type="dashed"
              size="small"
              onClick={() => {
                onClickEdit(record.id)
              }}
            >
              {t('Edit')}
            </Button>
          )}
        </Space>
      ),
    },
  ]

  useEffect(() => {
    getRoles({ current: 1, pageSize: 10 })
  }, [getRoles])

  return (
    <div>
      <AuthFragment authKey="test">
        <div>test</div>
      </AuthFragment>
      <div className="filter-container">
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
      </div>

      <Table
        loading={getLoading}
        rowKey="id"
        dataSource={roles.list}
        columns={columns}
        pagination={false}
      >
      </Table>
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
