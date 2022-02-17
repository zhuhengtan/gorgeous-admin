import React, { useCallback, useEffect, useMemo } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import {
  Table, Input, Select, Button, Space, Row,
} from 'antd'
import api from '@/service'
import { useRequest } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { cloneDeep } from 'lodash'
import { v4 } from 'uuid'

const {
  getAllApis: getAllApisRequest,
} = api

export interface Operation {
  id?: number | string
  name: string
  key: string
  relatedApi: string
  createdAt?: string
}

interface Props {
  value?: Operation[]
  onChange?: (val: Operation[]) => void
}

const OperationEdit: React.FC<Props> = (props: Props) => {
  const { value, onChange } = props

  const { t } = useTranslation()

  const {
    run: getAllApis,
    loading,
    data: apiList,
  } = useRequest<string[], any>(() => getAllApisRequest(), {
    manual: true,
  })

  const onChangeValue = useCallback((id, key, val) => {
    console.log(value)
    const tmp = cloneDeep(value || [])
    tmp.some((item: Operation) => {
      if (item.id === id) {
        (item as any)[key] = val
        return true
      }
      return false
    })
    onChange!(tmp)
  }, [value, onChange])

  const deleteOperation = useCallback((id) => {
    const tmp = cloneDeep(value || []).filter((row) => row.id !== id)
    onChange!(tmp)
  }, [value, onChange])

  const columns = useMemo(() => [
    {
      title: t('Operation name'),
      dataIndex: 'name',
      render: (text: string, row: Operation) => (
        <Input bordered={false} size="small" value={row.name} onChange={(e) => onChangeValue(row.id, 'name', e.currentTarget.value)} />
      ),
    },
    {
      title: t('Operation key'),
      dataIndex: 'key',
      render: (text: string, row: Operation) => (
        <Input bordered={false} size="small" value={row.key} onChange={(e) => onChangeValue(row.id, 'key', e.currentTarget.value)} />
      ),
    },
    {
      title: t('Operation api'),
      dataIndex: 'relatedApi',
      render: (text: string, row: Operation) => (
        <Select bordered={false} size="small" value={row.relatedApi} loading={loading} onChange={(e) => onChangeValue(row.id, 'relatedApi', e)}>
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
        <Button size="small" type="text" icon={<CloseOutlined />} onClick={() => deleteOperation(row.id)}></Button>
      ),
    },
  ], [])

  const onClickAddOperation = useCallback(() => {
    const tmp = [{
      id: `tmp_${v4()}`,
      name: '',
      key: '',
      relatedApi: '',
    }, ...(value || [])]
    console.log(tmp)
    onChange!(tmp)
  }, [value, onChange])

  useEffect(() => {
    getAllApis()
  }, [])

  return (
    <>
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
    </>
  )
}

OperationEdit.defaultProps = {
  value: [],
  onChange: (val) => { },
}

export default React.memo(OperationEdit)
