import React, { useCallback, useEffect, useMemo } from 'react'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  Table, Input, Select, Button, Space, Row, Col,
} from 'antd'
import api from '@/service'
import { useRequest } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'
import { cloneDeep } from 'lodash'
import { Operation } from '../types'

const {
  getAllApis: getAllApisRequest,
  deleteOperation: deleteOperationRequest,
} = api

interface Props {
  value?: Operation[]
  onChange?: (val: Operation[]) => void
  onDeleteOperation?: ()=>void
}

const OperationEdit: React.FC<Props> = (props: Props) => {
  const { value, onChange, onDeleteOperation } = props

  const { t } = useTranslation()

  const {
    run: getAllApis,
    loading,
    data: apiList,
  } = useRequest<string[], any>(() => getAllApisRequest(), {
    manual: true,
  })

  const {
    run: deleteOperation,
    loading: deleting,
  } = useRequest((id) => deleteOperationRequest({ id }), {
    manual: true,
    onSuccess() {
      if (onDeleteOperation) {
        onDeleteOperation()
      }
    },
  })

  const onChangeValue = useCallback((id: number | string, key: string, val: any) => {
    const tmp = cloneDeep(value || []);
    (tmp as Operation[]).some((item: Operation) => {
      if (item.id === id) {
        (item as any)[key] = val
        return true
      }
      return false
    })
    onChange!(tmp as Operation[])
  }, [value, onChange])

  const onClickDeleteTmpOperation = useCallback((id: number | string) => {
    const tmp = (cloneDeep(value || []) as Operation[]).filter((row) => row.id !== id)
    onChange!(tmp)
  }, [value, onChange])

  const onClickDeleteOperation = useCallback((id: number | string) => {
    deleteOperation(id)
  }, [deleteOperation])

  const columns = useMemo(() => [
    {
      title: t('Operation name'),
      dataIndex: 'name',
      render: (text: string, row: Operation) => (
        <Input bordered={false} size="small" value={row.name} onChange={(e) => onChangeValue(row.id!, 'name', e.currentTarget.value)} />
      ),
    },
    {
      title: t('Operation key'),
      dataIndex: 'key',
      render: (text: string, row: Operation) => (
        <Input bordered={false} size="small" value={row.key} onChange={(e) => onChangeValue(row.id!, 'key', e.currentTarget.value)} />
      ),
    },
    {
      title: t('Operation api'),
      dataIndex: 'relatedApi',
      width: 300,
      render: (text: string, row: Operation) => (
        <Select
          style={{ width: 280 }}
          bordered={false}
          size="small"
          showSearch
          value={row.relatedApi}
          loading={loading}
          onChange={(e) => onChangeValue(row.id!, 'relatedApi', e)}
        >
          {apiList && apiList.map((api) => (
            <Select.Option key={api} value={api}>{api}</Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: t('Operation'),
      dataIndex: 'id',
      render: (text: string, row: Operation) => (
        (row.id?.toString() as string).indexOf('tmp') >= 0 ? (
          <Button size="small" type="text" icon={<CloseOutlined />} onClick={() => onClickDeleteTmpOperation(row.id!)}></Button>
        ) : (
          <Button size="small" type="text" icon={<DeleteOutlined />} onClick={() => onClickDeleteOperation(row.id!)}></Button>
        )
      ),
    },
  ], [apiList, onClickDeleteTmpOperation, onClickDeleteOperation, loading, onChangeValue, t])

  const onClickAddOperation = useCallback(() => {
    const tmp = [{
      id: `tmp_${v4()}`,
      name: '',
      key: '',
      relatedApi: '',
    }, ...(value || [])]
    onChange!(tmp)
  }, [value, onChange])

  useEffect(() => {
    getAllApis()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Col>
      <Button
        size="small"
        type="primary"
        onClick={onClickAddOperation}
      >
        {t('Add operation')}
      </Button>
      <Table
        rowKey="id"
        style={{ marginTop: 10 }}
        size="small"
        scroll={{ y: 300 }}
        pagination={false}
        columns={columns}
        dataSource={value}
      />
    </Col>
  )
}

OperationEdit.defaultProps = {
  value: [],
  onChange: (val) => { },
  onDeleteOperation: () => {},
}

export default React.memo(OperationEdit)
