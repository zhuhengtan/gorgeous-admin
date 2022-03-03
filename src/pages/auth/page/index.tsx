import {
  Table, Tag, Button, Space, Popconfirm, Form, Input, Modal, Radio,
} from 'antd'
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import api from '@/service'
import { usePagination, useRequest } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { showMessage } from '@/utils'
import AuthFragment from '@/components/auth-fragment'
import OperationEdit from './operation'
import { Operation, Page } from '../types'
import Field from './field'
import RouteConfigure from './route-configure'

const {
  getPageList: getPageListRequest,
  createPage: createPageRequest,
  updatePage: updatePageRequest,
  deletePage: deletePageRequest,
  getPageDetail: getPageDetailRequest,
} = api

const Pages: React.FC = () => {
  const { t } = useTranslation()
  const [pageList, setPageList] = useState<Page[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<number>(0)
  const [pageType, setPageType] = useState<number>(0)
  const [path, setPath] = useState<string>('')
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
    run: getPageDetail,
  } = useRequest((id) => getPageDetailRequest({ id }), {
    manual: true,
    onSuccess(res: Page) {
      form.setFieldsValue(res)
      setVisible(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns = useMemo(() => [
    { dataIndex: 'name', title: t('Page name'), width: 200 },
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
          <AuthFragment authKey="update">
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setEditingId(row.id)
                getPageDetail(row.id)
              }}
            >{t('Edit')}
            </Button>
          </AuthFragment>
          <AuthFragment authKey="delete">
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
          </AuthFragment>
        </Space>
      ),
    },
  ], [deletePage, getPageDetail, t])

  const onClickOk = useCallback(() => {
    const data = form.getFieldsValue()
    if (editingId) {
      updatePage(data)
    } else {
      createPage(data)
    }
  }, [createPage, form, editingId, updatePage])

  const onDeleteOperation = useCallback(() => {
    getPageList({ current: pagination.current, pageSize: pagination.pageSize })
    getPageDetail(editingId)
  }, [editingId, getPageDetail, getPageList, pagination])

  return (
    <>
      <AuthFragment authKey="add">
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setEditingId(0)
            form.resetFields()
            setVisible(true)
          }}
        >
          {t('Create')}
        </Button>
      </AuthFragment>
      <AuthFragment authKey="view">
        <Table
          style={{ marginTop: 10 }}
          size="small"
          rowKey="id"
          columns={columns}
          loading={listLoading}
          dataSource={pageList}
          pagination={pagination}
        />
      </AuthFragment>
      <Modal
        title={editingId ? t('Edit page') : t('Create page')}
        visible={visible}
        maskClosable={false}
        width={1200}
        onCancel={() => setVisible(false)}
        confirmLoading={updating || creating}
        onOk={onClickOk}
      >
        <Form form={form} initialValues={{ pageType: 0 }}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>
          <Form.Item label={t('Page name')} name="name">
            <Input placeholder={t('Please input page name')} />
          </Form.Item>
          <Form.Item label={t('Page path')} name="path">
            <Input placeholder={t('Please input page path')} onChange={(e) => setPath(e.currentTarget.value)} />
          </Form.Item>
          <Form.Item label={t('Page type')} name="pageType">
            <Radio.Group onChange={(e) => setPageType(e.target.value)}>
              <Radio value={0}>{t('Page type hand-writing')}</Radio>
              <Radio value={1}>{t('Page type configure')}</Radio>
              <Radio value={2}>{t('Page type generate')}</Radio>
            </Radio.Group>
          </Form.Item>
          {pageType === 0
            && (
              <Form.Item label={t('Page operations')} name="operations">
                <OperationEdit onDeleteOperation={onDeleteOperation} />
              </Form.Item>
            )}
          {(pageType === 1 || pageType === 2)
            && (
              <>
                <Form.Item label={t('Page entity name')} name="entityName">
                  <Input placeholder={t('Page entity placeholder')} />
                </Form.Item>
                <Form.Item label={t('Page fields')} name="fields">
                  <Field />
                </Form.Item>
              </>
            )}
        </Form>
        {(pageType === 1 || pageType === 2) && path && (
          <>
            <RouteConfigure path={path} pageType={pageType} />
          </>
        )}
      </Modal>
    </>
  )
}

export default React.memo(Pages)
