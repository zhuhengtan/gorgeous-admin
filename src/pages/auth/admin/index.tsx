import { usePagination, useRequest } from 'ahooks'
import {
  Button, Input, Popconfirm, Row, Select, Space, Table, Tag,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/service'

import AuthFragment from '@/components/auth-fragment'
import styles from './index.module.less'
import AddAdminForm from './add-admin-form'

import { Admin, Role } from '../types'

const {
  getAdmins: getAdminsRequest,
  changeAdminStatus: changeAdminStatusRequest,
  resetPassword: resetPasswordRequest,
  deleteAdmin: deleteAdminRequest,
} = api

const Admins: React.FC = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState({
    name: '',
  })
  const [admins, setAdmins] = useState<Admin[]>([])
  const [addPanelVisible, setAddPanelVisible] = useState<boolean>(false)
  const [selectedAdminId, setSelectedAdminId] = useState<number>(0)

  const { run: getAdmins, loading: getLoading, pagination } = usePagination(
    ({ current, pageSize }, filters) => getAdminsRequest({
      current_page: current,
      page_size: pageSize,
      ...filters,
    }),
    {
      manual: true,
      throttleWait: 500,
      onSuccess(e: any) {
        setAdmins(e.list)
      },
    },
  )

  const { run: changeAdminStatus } = useRequest(
    ({ id, status }) => changeAdminStatusRequest({ id, status }),
    {
      manual: true,
      onSuccess() {
        getAdmins({ ...pagination }, filter)
      },
    },
  )

  const { run: resetPassword, loading: resetLoading } = useRequest(
    (id) => resetPasswordRequest({ id }),
    {
      manual: true,
    },
  )

  const { run: removeAdmin } = useRequest((id) => deleteAdminRequest({ id }), {
    manual: true,
    onSuccess() {
      getAdmins({ current: pagination.current, pageSize: pagination.pageSize }, filter)
    },
  })

  const columns = [
    {
      title: t('Id'),
      dataIndex: 'id',
    },
    {
      title: t('Adminname'),
      dataIndex: 'name',
    },
    {
      title: t('Email'),
      dataIndex: 'email',
    },
    {
      title: t('Admin type'),
      dataIndex: 'admin_type',
      render: (text: string, record: Admin) => (
        <Space size="middle">
          {record.adminType === 0 && (
            <Tag color="blue">{t('System admin')}</Tag>
          )}
          {record.adminType === 1 && (
            <Tag color="orange">{t('Created admin')}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('Role name'),
      dataIndex: 'role_name',
      render: (text: string, record: Admin) => (
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
      render: (text: string, record: Admin) => (
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
      render: (text: string, record: Admin) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setSelectedAdminId(record.id)
              setAddPanelVisible(true)
            }}
          >{t('Edit')}
          </Button>
          <AuthFragment authKey="delete">
            <Popconfirm
              title={t('Are you sure to remove this admin')}
              onConfirm={() => {
                removeAdmin(record.id)
              }}
              okText={t('Confirm')}
              cancelText={t('Cancel')}
            >
              <Button danger size="small">
                {t('Remove')}
              </Button>
            </Popconfirm>
          </AuthFragment>
          <AuthFragment authKey="reset-password" otherConditions={record.adminType === 1}>
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
          </AuthFragment>
        </Space>
      ),
    },
  ]

  useEffect(() => {
    getAdmins({ current: 1, pageSize: 10 }, filter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className={styles['filter-container']}>
        <div>
          <Input
            placeholder={t('Filter with admin name or email')}
            allowClear
            onChange={(e) => {
              e.persist()
              setFilter({ name: e.currentTarget.value })
              getAdmins(
                {
                  current: 1,
                  pageSize: pagination.pageSize,
                },
                { name: e.currentTarget.value },
              )
            }}
          />
        </div>
        <AuthFragment authKey="create">
          <Button
            type="primary"
            onClick={() => {
              setAddPanelVisible(true)
            }}
          >
            {t('Add admin')}
          </Button>
        </AuthFragment>
      </div>
      <AuthFragment authKey="view">
        <Table
          loading={getLoading}
          rowKey="id"
          dataSource={admins}
          columns={columns}
          pagination={pagination}
        />
      </AuthFragment>
      <AddAdminForm
        id={selectedAdminId}
        visible={addPanelVisible}
        onCancel={() => {
          setSelectedAdminId(0)
          setAddPanelVisible(false)
        }}
        onSuccess={() => {
          setSelectedAdminId(0)
          getAdmins({ ...pagination }, filter)
        }}
      />
    </div>
  )
}

export default React.memo(Admins)
