import React, {
  useEffect,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  Space, Table,
} from 'antd'
import { usePagination } from 'ahooks'
import AuthFragment from '@/components/auth-fragment'
import APIFunction from '@/service'
import EditModal from './edit-modal'

const GenerateServerCRUD: React.FC = () => {
  const { t } = useTranslation()
  const {
    data,
    run: getGeneratedEntityList,
    pagination,
  } = usePagination<
    {
      list: { id: number; entityName: string; createdAt: string }[];
      total: number;
    },
    any
  >(
    ({ current, pageSize }) => APIFunction.getGeneratedEntityList({ current, pageSize }),
    {
      manual: true,
    },
  )

  useEffect(() => {
    getGeneratedEntityList({ current: 1, pageSize: 10 })
  }, [getGeneratedEntityList])

  return (
    <>
      <AuthFragment authKey="create">
        <EditModal
          onCreateSuccess={() => {
            getGeneratedEntityList({ current: 1, pageSize: 10 })
          }}
        />
      </AuthFragment>
      <Table
        style={{ marginTop: 10 }}
        rowKey="id"
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
          },
          {
            title: t('Page entity name'),
            dataIndex: 'entityName',
          },
          {
            title: t('Create at'),
            dataIndex: 'createdAt',
          },
          {
            title: t('Operation'),
            dataIndex: 'id',
            render(value, record) {
              return (
                <Space>
                  <AuthFragment authKey="update">
                    <EditModal
                      isEdit
                      record={record}
                      onUpdateSuccess={() => {
                        getGeneratedEntityList({ current: 1, pageSize: 10 })
                      }}
                    />
                  </AuthFragment>
                </Space>
              )
            },
          },
        ]}
        dataSource={data?.list || []}
        pagination={pagination}
      />

    </>
  )
}

export default React.memo(GenerateServerCRUD)
