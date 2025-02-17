import {
  Button,
  Modal,
  Popconfirm,
  Space,
  Tooltip,
} from 'antd'
import React, {
  NamedExoticComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import pureReqeust from '@/service/pure-request'
import { usePagination, useRequest } from 'ahooks'
import AuthFragment from '@/components/auth-fragment'
import Api from '@/service'
import FormRender, { FRProps, useForm } from 'form-render'
import TableRender, { SearchProps, TableContext } from 'table-render'
import { ColumnsType } from 'antd/es/table'
import ImageUpload from '@/components/upload'
import { CheckOutlined, CloseOutlined, SettingFilled } from '@ant-design/icons'
import EntitySelect from '@/components/entity-select'
import EditModal from '../auth/generate-server-crud/edit-modal'
import { useAllAuth } from '@/context/auth-context-provider'
import FileManageList from '@/components/file-manage-list'
import Richtext from '@/components/richtext'

export const WIDGETS_MAP: {
  [key in any]: NamedExoticComponent<{
    readOnly?: boolean;
    value?: any;
    onChange?: (v: any) => void;
  }>;
} = {
  imageUpload: ImageUpload as NamedExoticComponent,
  entitySelect: EntitySelect as NamedExoticComponent,
  fileManageList: FileManageList as NamedExoticComponent,
  richtext: Richtext as NamedExoticComponent,
}

interface Props {
  entityName: string;
}

type RowData = {
  id: number;
} & JsonObject;

export interface EntityDetailField {
  name: string;
  type: string;
  title: string;
  comment: string;
  editable: boolean;
  columnName: string;
  columnType: string;
  columnDefaultValue: string;
  displayKeyMap?: string;
  valueKeyMap?: string;
  editSchema?: Partial<FRProps['schema']>;
  searchSchema?: Partial<SearchProps<RowData>['schema']>;
}
export interface EntityDetail {
  id: number;
  entityName: string;
  fields: EntityDetailField[];
  createdAt: string;
  deletedAt: string;
}

const GeneratedPage: React.FC<Props> = (props: Props) => {
  const { entityName } = props
  console.log(entityName)

  const path = window.location.pathname
  // 从auth里拿接口
  const allAuth = useAllAuth()
  const [open, setOpen] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const apis = useMemo(() => {
    const tmp: { [key: string]: string } = {}
    allAuth[path].forEach((authRoute) => {
      tmp[authRoute.operationKey] = authRoute.relatedApis[0]
    })
    return tmp
  }, [allAuth, path])
  const form = useForm()

  const { data: entityDetail, run: getGeneratedEntityDetail } = useRequest<
    EntityDetail,
    { entityName: string }[]
  >(() => Api.getCommonGeneratedEntityDetail({ entityName }), {
    manual: true,
  })
  useEffect(() => {
    getGeneratedEntityDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    runAsync: getDataListAsync,
  } = usePagination(
    ({ current, pageSize }) => pureReqeust(apis.view, { current, pageSize }) as Promise<any>,
    {
      manual: true,
    },
  )

  const { run: create } = useRequest(
    (params) => pureReqeust(apis.create, params),
    {
      manual: true,
      onSuccess() {
        setOpen(false)
        tableRef.current?.refresh()
      },
    },
  )

  const { run: update } = useRequest(
    (params) => pureReqeust(apis.update, params),
    {
      manual: true,
      onSuccess() {
        setOpen(false)
        tableRef.current?.refresh()
      },
    },
  )

  const { run: deleteRow } = useRequest(
    (id) => pureReqeust(apis.delete, { id }),
    {
      manual: true,
      onSuccess() {
        tableRef.current?.refresh()
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
    if (entityDetail?.fields && entityDetail?.fields.length > 0) {
      entityDetail?.fields.forEach((field) => {
        properties[field.name] = {
          title: field.title,
          type: field.type, // TODO 判断type string、number、枚举
          disabled: !field.editable,
          default:
            field.type === 'number'
              ? Number(field.columnDefaultValue) || undefined
              : field.columnDefaultValue,
          tooltip: field.comment,
          ...(field.editSchema || {}),
          props: {
            allowClear: true,
            ...(field?.editSchema?.props || {}),
          },
        }
      })
    }
    return {
      type: 'object',
      properties,
    }
  }, [entityDetail])

  const columns = useMemo<ColumnsType<RowData>>(() => {
    if (!entityDetail) {
      return []
    }
    const tmp: ColumnsType<RowData> = entityDetail?.fields.map(
      (field: EntityDetailField) => ({
        dataIndex: field.name,
        title: (
          <Tooltip title={field.comment}>
            <span>{field.title}</span>
          </Tooltip>
        ),
        tooltip: field.comment,
        render: (value, row) => {
          if (value === undefined || value === '') {
            return <></>
          }
          if (field.type === 'boolean') {
            return (
              <>
                {value ? (
                  <CheckOutlined style={{ color: 'green' }} />
                ) : (
                  <CloseOutlined style={{ color: 'red' }} />
                )}
              </>
            )
          }
          if (field.displayKeyMap) {
            const keyArr = field.displayKeyMap.split('.')
            let t: any = row
            keyArr.forEach((key) => {
              t = t[key]
            })
            return <span>{t}</span>
          }
          if (field.editSchema?.readOnlyWidget) {
            switch (field.editSchema?.readOnlyWidget) {
              case 'select':
              case 'radio':
                if (field.editSchema?.props) {
                  return (
                    <span>
                      {
                        field.editSchema?.props?.options?.find(
                          // eslint-disable-next-line eqeqeq
                          (item: { value: any }) => item.value == value,
                        )?.label
                      }
                    </span>
                  )
                }
                return <span>-</span>
              default:
                return React.createElement(
                  WIDGETS_MAP[field.editSchema?.readOnlyWidget],
                  {
                    readOnly: true,
                    value,
                  },
                )
            }
          }
          return <span>{value}</span>
        },
      }),
    )
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
                const tmpFormData = { ...rowData }
                entityDetail?.fields.forEach((item) => {
                  if (item.valueKeyMap) {
                    const keyArr = item.valueKeyMap.split('.')
                    let t: any = rowData
                    keyArr.forEach((key) => {
                      t = t[key]
                    })
                    tmpFormData[item.name] = t
                  }
                })
                form.setValues(tmpFormData)
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
  }, [deleteRow, entityDetail, form])

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

  const tableRef = useRef<TableContext>()

  return (
    <>
      <AuthFragment authKey="edit-entity">
        <EditModal
          isEdit
          record={entityDetail}
          buttonContainerStyle={{
            position: 'absolute',
            cursor: 'pointer',
            right: 0,
            top: 0,
            borderTop: '40px solid #ca0813',
            borderLeft: '40px solid transparent',
          }}
        >
          <SettingFilled
            style={{
              color: 'white',
              position: 'absolute',
              left: -20,
              top: -34,
            }}
          />
        </EditModal>
      </AuthFragment>
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
        <TableRender
          size="small"
          ref={tableRef as any}
          style={{ marginTop: 10, padding: 0 }}
          rowKey="id"
          columns={columns as any}
          request={async (params) => {
            const res = await getDataListAsync(params)
            return { data: res.list, total: res.total }
          }}
        />
      </AuthFragment>
      <Modal
        title={isEdit ? '编辑' : '新增'}
        width="60%"
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
          schema={editSchema}
          onFinish={onFinish}
          removeHiddenData={false}
          widgets={WIDGETS_MAP}
        />
      </Modal>
    </>
  )
}

export default React.memo(GeneratedPage)
