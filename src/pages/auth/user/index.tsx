import './index.less'

import { usePagination, useRequest } from 'ahooks'
import {
  Button, Input, Popconfirm, Row, Select, Space, Table, Tag,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/service'

import AddUserForm from './add-user-form'

import { User, Role } from '../types'

const {
  getUsers: getUsersRequest,
  changeUserStatus: changeUserStatusRequest,
  resetPassword: resetPasswordRequest,
  deleteUser: deleteUserRequest,
} = api

const Users: React.FC = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState({
    name: '',
  })
  const [users, setUsers] = useState<User[]>([])
  const [addPanelVisible, setAddPanelVisible] = useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = useState<number>(0)

  const { run: getUsers, loading: getLoading, pagination } = usePagination(
    ({ current, pageSize }, filters) => getUsersRequest({
      current_page: current,
      page_size: pageSize,
      ...filters,
    }),
    {
      manual: true,
      throttleWait: 500,
      onSuccess(e: any) {
        setUsers(e.list)
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

  const { run: resetPassword, loading: resetLoading } = useRequest(
    (id) => resetPasswordRequest({ id }),
    {
      manual: true,
    },
  )

  const { run: removeUser } = useRequest((id) => deleteUserRequest({ id }), {
    manual: true,
    onSuccess() {
      getUsers({ current: pagination.current, pageSize: pagination.pageSize }, filter)
    },
  })

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
          {record.userType === 0 && (
            <Tag color="blue">{t('System user')}</Tag>
          )}
          {record.userType === 1 && (
            <Tag color="orange">{t('Created user')}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('Role name'),
      dataIndex: 'role_name',
      render: (text: string, record: User) => (
        <Space size="middle">
          {record.roles.map((role: Role) => (
            <Tag key={role.id} color="success">{role.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: (text: string, record: User) => (
        <Space size="middle">
          {record.status === 0 && <Tag color="red">{t('Disable')}</Tag>}
          {record.status === 1 && <Tag color="success">{t('Enable')}</Tag>}
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
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setSelectedUserId(record.id)
              setAddPanelVisible(true)
            }}
          >{t('Edit')}
          </Button>
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
          {record.userType === 1 && (
            <Popconfirm
              title={t('Are you sure to reset password')}
              onConfirm={() => {
                resetPassword(record.id)
              }}
              okText={t('Confirm')}
              cancelText={t('Cancel')}
            >
              <Button loading={resetLoading} type="primary" size="small">
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
        dataSource={users}
        columns={columns}
        pagination={pagination}
      />
      <AddUserForm
        id={selectedUserId}
        visible={addPanelVisible}
        setVisible={setAddPanelVisible}
        onSuccess={() => {
          setSelectedUserId(0)
          getUsers({ ...pagination }, filter)
        }}
      />
    </div>
  )
}

export default React.memo(Users)
