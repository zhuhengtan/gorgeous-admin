import {
  Table, Tag, Button, Space, Popconfirm, Form, Input, Modal,
} from 'antd'
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import api from '@/service'
import { usePagination, useRequest } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { showMessage } from '@/utils'
import OperationEdit, { Operation } from './operation'

const {
  getPageList: getPageListRequest,
  createPage: createPageRequest,
  updatePage: updatePageRequest,
  deletePage: deletePageRequest,
} = api

interface Page {
  id: number
  name: string
  path: string
  createdAt: string
  operations: Operation[]
}

const Pages: React.FC = () => {
  const { t } = useTranslation()
  const [pageList, setPageList] = useState<Page[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [form] = Form.useForm()

  const {
    run: getPageList,
    pagination,
    loading: listLoading,
  } = usePagination(({ current, pageSize }) => getPageListRequest({ page: current, pageSize }), {
    manual: true,
    onSuccess(e) {
      setPageList(e.list)
    },
  })

  const {
    run: updatePage,
    loading: updating,
  } = useRequest((data) => updatePageRequest(data), {
    manual: true,
    onSuccess() {
      showMessage(t('Update success'))
      setVisible(false)
      getPageList({ current: pagination.current, pageSize: pagination.pageSize })
    },
  })

  const {
    run: createPage,
    loading: creating,
  } = useRequest((data) => createPageRequest(data), {
    manual: true,
    onSuccess() {
      showMessage(t('Create success'))
      setVisible(false)
      getPageList({ current: pagination.current, pageSize: pagination.pageSize })
    },
  })

  const {
    run: deletePage,
  } = useRequest((id) => deletePageRequest({ id }), {
    manual: true,
    onSuccess(e) {
      showMessage(t('Delete success'))
      setVisible(false)
      getPageList({ current: pagination.current, pageSize: pagination.pageSize })
    },
  })

  useEffect(() => {
    getPageList({ current: 1, pageSize: 10 })
  }, [])

  const columns = useMemo(() => [
    { dataIndex: 'name', title: t('Page name'), width: 100 },
    { dataIndex: 'path', title: t('Page path'), width: 200 },
    {
      dataIndex: 'operations',
      title: t('Page operations'),
      render: (text: string, row: Page) => (
        <>
          {
            row.operations.map((operation: Operation) => (
              <Tag key={operation.name} color="success">{operation.name}</Tag>
            ))
          }
        </>
      ),
      width: 600,
    },
    {
      dataIndex: 'id',
      title: t('Operation'),
      render: (text: string, row: Page) => (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setIsEditing(true)
              form.setFieldsValue(row)
              setVisible(true)
            }}
          >{t('Edit')}
          </Button>
          <Popconfirm
            title={t('Are you sure to delete')}
            onConfirm={() => {
              deletePage(row.id)
            }}
            okText={t('Confirm')}
            cancelText={t('Cancel')}
          >
            <Button size="small" type="primary" danger>{t('Delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [])

  const onClickOk = useCallback(() => {
    const data = form.getFieldsValue()
    data.operations.forEach((operation: Operation) => {
      if (operation.id?.toString().indexOf('tmp') !== undefined && operation.id?.toString().indexOf('tmp') >= 0) {
        delete operation.id
      }
    })
    if (isEditing) {
      updatePage(data)
    } else {
      createPage(data)
    }
  }, [isEditing])

  return (
    <>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          setIsEditing(false)
          form.resetFields()
          setVisible(true)
        }}
      >
        {t('Create')}
      </Button>
      <Table
        style={{ marginTop: 10 }}
        size="small"
        rowKey="id"
        columns={columns}
        loading={listLoading}
        dataSource={pageList}
        pagination={pagination}
      />
      <Modal
        title={isEditing ? t('Edit page') : t('Create page')}
        visible={visible}
        width={800}
        onCancel={() => setVisible(false)}
        confirmLoading={updating || creating}
        onOk={onClickOk}
      >
        <Form form={form}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>
          <Form.Item label={t('Page name')} name="name">
            <Input placeholder={t('Please input page name')} />
          </Form.Item>
          <Form.Item label={t('Page path')} name="path">
            <Input placeholder={t('Please input page path')} />
          </Form.Item>
          <Form.Item label={t('Page operations')} name="operations">
            <OperationEdit />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default React.memo(Pages)
