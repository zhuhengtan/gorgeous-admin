import './index.less'

import { usePagination, useRequest } from 'ahooks'
import {
  Button, Input, Popconfirm, Row, Select, Space, Table, Tag,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/service'

import AddUserForm from './add-user-form'

interface User {
  id: number
  name: string
  user_type: string
  status: string
}

interface Role {
  id: number
  name: string
}

const {
  getUsers: getUsersRequest,
  changeUserStatus: changeUserStatusRequest,
  resetPassword: resetPasswordRequest,
  removeUser: removeUserRequest,
  getRoles: getRoleListRequest,
  updateUserRole: updateUserRoleRequest,
} = api

const Users: React.FC = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState({
    name: '',
  })
  const [users, setUsers] = useState({
    list: [],
    total: 0,
  })
  const [addPanelVisible, setAddPanelVisible] = useState<boolean>(false)
  const [roleList, setRoleList] = useState([])

  const { run: getUsers, loading: getLoading, pagination } = usePagination(
    ({ current, pageSize }, filters) => getUsersRequest({
      current_page: current,
      page_size: pageSize,
      ...filters,
    }),
    {
      manual: true,
      throttleWait: 500,
      onSuccess(e) {
        setUsers(e.list as any)
      },
    },
  )

  const { run: changeUserStatus } = useRequest(
    ({ id, status }) => changeUserStatusRequest({ id, status }),
    {
      manual: true,
      onSuccess() {
        getUsers({ ...pagination }, filter)
      },
    },
  )

  const { run: resetPassword } = useRequest(
    (id) => resetPasswordRequest({ id }),
    {
      manual: true,
    },
  )

  const { run: removeUser } = useRequest((id) => removeUserRequest({ id }), {
    manual: true,
    onSuccess() {
      getUsers({ current: 1, pageSize: pagination.pageSize }, filter)
    },
  })

  const { run: getRoleList, loading: getRoleLoading } = useRequest(
    () => getRoleListRequest(),
    {
      manual: true,
      onSuccess(e: any) {
        setRoleList(e.list)
      },
    },
  )

  const { run: changeUserRole } = useRequest(
    (uid, roleId) => updateUserRoleRequest({ id: uid, role_id: roleId }),
    {
      manual: true,
      onSuccess() {
        getUsers({ current: pagination.current, pageSize: pagination.pageSize }, {})
      },
    },
  )

  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id',
    },
    {
      title: t('Username'),
      dataIndex: 'name',
    },
    {
      title: t('Email'),
      dataIndex: 'email',
    },
    {
      title: t('User type'),
      dataIndex: 'user_type',
      render: (text: string, record: User) => (
        <Space size="middle">
          {record.user_type === '2' && (
            <Tag color="blue">{t('Outer user')}</Tag>
          )}
          {record.user_type === '1' && (
            <Tag color="orange">{t('Inner user')}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('Role name'),
      dataIndex: 'role_name',
      render: (text: string, record: User) => (
        <Select
          style={{ width: 140 }}
          bordered={false}
          loading={getRoleLoading}
          placeholder={text}
          onFocus={() => getRoleList()}
          onChange={(id) => changeUserRole(record.id, id)}
        >
          {roleList.map((role: Role) => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: (text: string, record: User) => (
        <Space size="middle">
          {record.status === '2' && <Tag color="red">{t('Disable')}</Tag>}
          {record.status === '1' && <Tag color="success">{t('Enable')}</Tag>}
        </Space>
      ),
    },
    {
      title: t('Last login time'),
      dataIndex: 'login_time',
    },
    {
      title: t('Operation'),
      dataIndex: 'operation',
      render: (text: string, record: User) => (
        <Space size="middle">
          {record.status === '1' && (
            <Popconfirm
              title={t('Are you sure to disable this user')}
              onConfirm={() => {
                changeUserStatus({ id: record.id, status: '2' })
              }}
              okText={t('Confirm')}
              cancelText={t('Cancel')}
            >
              <Button type="primary" danger size="small">
                {t('Disable')}
              </Button>
            </Popconfirm>
          )}
          {record.status === '2' && (
            <Popconfirm
              title={t('Are you sure to enable this user')}
              onConfirm={() => {
                changeUserStatus({ id: record.id, status: '1' })
              }}
              okText={t('Confirm')}
              cancelText={t('Cancel')}
            >
              <Button type="primary" className="enable-btn" size="small">
                {t('Enable')}
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title={t('Are you sure to remove this user')}
            onConfirm={() => {
              removeUser(record.id)
            }}
            okText={t('Confirm')}
            cancelText={t('Cancel')}
          >
            <Button danger size="small">
              {t('Remove')}
            </Button>
          </Popconfirm>
          {record.user_type === '2' && (
            <Popconfirm
              title={t('Are you sure to reset password')}
              onConfirm={() => {
                resetPassword(record.id)
              }}
              okText={t('Confirm')}
              cancelText={t('Cancel')}
            >
              <Button type="primary" size="small">
                {t('Reset password')}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  useEffect(() => {
    getUsers({ current: 1, pageSize: 10 }, filter)
  }, [])

  return (
    <div>
      <div className="filter-container">
        <div>
          <Input
            placeholder={t('Filter with username or email')}
            allowClear
            onChange={(e) => {
              e.persist()
              setFilter({ name: e.currentTarget.value })
              getUsers(
                {
                  current: 1,
                  pageSize: pagination.pageSize,
                },
                { name: e.currentTarget.value },
              )
            }}
          />
        </div>
        <Button
          type="primary"
          onClick={() => {
            setAddPanelVisible(true)
          }}
        >
          {t('Add user')}
        </Button>
      </div>
      <Table
        loading={getLoading}
        rowKey="id"
        dataSource={users.list}
        columns={columns}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            getUsers({ current: page, pageSize: pageSize || 10 }, filter)
          },
        }}
      />
      <AddUserForm
        visible={addPanelVisible}
        setVisible={setAddPanelVisible}
        onSuccess={() => getUsers({ ...pagination }, filter)}
      />
      {/* <EditForm
        id={id}
        roleId={roleId}
        bindRole={bindRole}
        editFormVisible={editFormVisible}
        setEditFormVisible={setEditFormVisible}
      ></EditForm> */}
    </div>
  )
}

export default React.memo(Users)
