import {
  Button, Modal, Popconfirm, Space, Table, TableColumnType,
} from 'antd'
import React, {
  NamedExoticComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePagination, useRequest } from 'ahooks'
import FormRender, { FRProps, useForm } from 'form-render'
import { ColumnsType } from 'antd/es/table'
import pureRequest from '@/service/pure-request'
import AuthFragment from '@/components/auth-fragment'
import Api from '@/service'
import { AdminAuthContext } from '@/context/AdminAuthContext'
import ImageUpload from '@/components/image-upload'
import DateTimePicker from '@/components/date-time-picker'

const WIDGETS_MAP: {
  [key in any]: NamedExoticComponent<{
    readOnly?: boolean;
    value?: any;
    onChange?: (v: any) => void;
  }>;
} = {
  imageUpload: ImageUpload as NamedExoticComponent,
}

interface Props {
  entityName: string;
}

interface EntityDetailKey {
  name: string;
  type: string;
  title: string;
  comment: string;
  editable: boolean;
  columnName: string;
  columnType: string;
  editComponent: string;
  columnDefaultValue: string;
  tableDataIndex: string;
  tableDisplayKey: string;
  valueKey: string;
}

type RowData = {
  id: number
} & {
  [key in string]: any
}

interface EntityDetail {
  id: number;
  entityName: string;
  keys: EntityDetailKey[];
  editSchema?: string;
  createdAt: string;
  deletedAt: string;
}

const GeneratedPage: React.FC<Props> = (props: Props) => {
  const { entityName } = props

  const path = window.location.pathname
  // 从auth里拿接口
  const authRoutes = useContext(AdminAuthContext)

  const [open, setOpen] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const apis = useMemo(() => {
    const tmp: { [key: string]: string } = {}
    authRoutes[path].forEach((authRoute) => {
      tmp[authRoute.operationKey] = authRoute.relatedApi
    })
    return tmp
  }, [authRoutes, path])
  const form = useForm()

  const { data: entityDetail, run: getGeneratedEntityDetail } = useRequest<
    EntityDetail,
    { entityName: string }[]
  >(() => Api.getGeneratedEntityDetail({ entityName }), {
    manual: true,
  })
  useEffect(() => {
    getGeneratedEntityDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [data, setData] = useState([])
  const { run: getDataList, pagination } = usePagination(
    ({ current, pageSize }) => pureRequest(apis.view, { page: current, pageSize }) as Promise<any>,
    {
      manual: true,
      onSuccess(res) {
        setData(res.list)
      },
    },
  )

  const { run: create, loading: creating } = useRequest(
    (params) => pureRequest(apis.create, params),
    {
      manual: true,
      onSuccess(res) {
        setOpen(false)
        getDataList({ current: 1, pageSize: pagination.pageSize })
      },
    },
  )

  const { run: update } = useRequest(
    (params) => pureRequest(apis.update, params),
    {
      manual: true,
      onSuccess() {
        setOpen(false)
        getDataList({
          current: pagination.current,
          pageSize: pagination.pageSize,
        })
      },
    },
  )

  const { run: deleteRow } = useRequest(
    (id) => pureRequest(apis.delete, { id }),
    {
      manual: true,
      onSuccess() {
        getDataList({ current: 1, pageSize: 10 })
      },
    },
  )

  const editSchema = useMemo<FRProps['schema']>(() => {
    const properties: FRProps['schema']['properties'] = {
      id: {
        hidden: true,
        type: 'number',
      },
    }
    entityDetail?.keys.forEach((keyItem) => {
      properties[keyItem.name] = {
        title: keyItem.title,
        type: keyItem.type,
        widget: keyItem.editComponent,
        disabled: !keyItem.editable,
        default: keyItem.columnDefaultValue,
        tooltip: keyItem.comment,
      }
    })
    return {
      type: 'object',
      properties,
    }
  }, [entityDetail])

  const columns = useMemo<ColumnsType<any>>(() => {
    if (!entityDetail) {
      return []
    }
    const tmp: ColumnsType<any> = entityDetail?.keys.map((keyItem) => ({
      dataIndex: keyItem.tableDataIndex || keyItem.name,
      title: keyItem.title,
      render: (value, row) => {
        if (keyItem.tableDisplayKey) {
          const keyPath = keyItem.tableDisplayKey.split('.')
          let v: any = row
          keyPath.forEach((key) => {
            v = v[key]
          })
          return <span>{v}</span>
        }
        if (keyItem.editComponent) {
          return React.createElement(WIDGETS_MAP[keyItem.editComponent], {
            readOnly: true,
            value,
          })
        }
        return <span>{value}</span>
      },
    }))
    tmp.splice(0, 0, {
      dataIndex: 'id',
      title: 'ID',
    })
    tmp.push({
      dataIndex: 'id',
      title: '操作',
      render: (dataIndex: string, rowData: RowData) => (
        <Space>
          <AuthFragment authKey="update">
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setIsEdit(true)
                const rowValue: RowData = { id: rowData.id }
                const schema: FRProps['schema'] = entityDetail?.editSchema ? JSON.parse(entityDetail.editSchema) : editSchema
                if (schema.properties && Object.keys(schema.properties).length > 0) {
                  Object.keys(schema.properties).forEach((key) => {
                    if (!schema.properties![key].disabled) {
                      const tableDisplayKey = entityDetail.keys.find((item) => item.name === key)?.tableDisplayKey
                      if (!tableDisplayKey) {
                        rowValue[key] = rowData[key]
                      } else {
                        const keyPath = tableDisplayKey.split('.')
                        let v: any = rowData
                        keyPath.forEach((key) => {
                          v = v[key]
                        })
                        rowValue[key] = v
                      }
                    }
                  })
                }
                form.setValues(rowValue)
                setOpen(true)
              }}
            >
              编辑
            </Button>
          </AuthFragment>
          <AuthFragment authKey="delete">
            <Popconfirm
              title="确定要删除该条数据？"
              onConfirm={() => deleteRow(rowData.id)}
            >
              <Button size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </AuthFragment>
        </Space>
      ),
    })
    return tmp
  }, [deleteRow, editSchema, entityDetail, form])

  const onFinish = useCallback(
    (allValues: any) => {
      if (isEdit) {
        update(allValues)
      } else {
        create(allValues)
      }
    },
    [create, update, isEdit],
  )

  useEffect(() => {
    getDataList({ current: 1, pageSize: 10 })
  }, [getDataList])

  return (
    <>
      <AuthFragment authKey="create">
        <Button
          type="primary"
          onClick={() => {
            setIsEdit(false)
            form.resetFields()
            setOpen(true)
          }}
        >
          新增
        </Button>
      </AuthFragment>
      <AuthFragment authKey="view">
        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          style={{ marginTop: 10 }}
          pagination={pagination}
        />
      </AuthFragment>
      <Modal
        title={isEdit ? '编辑' : '新增'}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={(
          <Space>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button type="primary" onClick={() => form.submit()}>
              确认
            </Button>
          </Space>
        )}
      >
        <FormRender
          displayType="row"
          form={form}
          schema={entityDetail?.editSchema ? JSON.parse(entityDetail.editSchema) : editSchema}
          onFinish={onFinish}
          removeHiddenData={false}
          widgets={{
            imageUpload: ImageUpload,
            dateTimePicker: DateTimePicker,
          }}
        />
      </Modal>
    </>
  )
}

export default React.memo(GeneratedPage)
