import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Input, Table, Button, Switch, Col, Modal,
} from 'antd'
import { CloseOutlined, DeleteOutlined, EditFilled } from '@ant-design/icons'
import { v4 } from 'uuid'
import { cloneDeep } from 'lodash'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'

import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'
import { JsonEditor } from 'json-edit-react'
import { FieldItem } from '../types'

interface Props {
  value?: FieldItem[];
  onChange?: (v: FieldItem[]) => void;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  }

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  )
}

const Fields: React.FC<Props> = (props: Props) => {
  const { value = [], onChange } = props
  const { t } = useTranslation()

  const onChangeValue = useCallback(
    (id: string, key: string, val: any) => {
      const tmp: any = cloneDeep(value)
      tmp.some((item: FieldItem) => {
        if (item.id === id) {
          (item as any)[key] = val
          return true
        }
        return false
      })
      onChange?.(tmp)
    },
    [value, onChange],
  )

  const onClickDeleteTmpField = useCallback(
    (id: number | string) => {
      const tmp = (cloneDeep(value || []) as FieldItem[]).filter(
        (row) => row.id !== id,
      )
      onChange?.(tmp)
    },
    [value, onChange],
  )

  const onClickDeleteField = useCallback((id: number | string) => id, [])

  const [editJsonOpen, setEditJsonOpen] = useState<boolean>(false)
  const [tmpSelectObj, setTmpSelectObj] = useState({ id: '', k: '', v: {} })
  const columns = useMemo(() => {
    const config = [
      {
        type: 'input',
        title: t('Configuration item title'),
        key: 'title',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item name'),
        key: 'name',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item type'),
        key: 'type',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item column name'),
        key: 'columnName',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item column type'),
        key: 'columnType',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item comment'),
        key: 'comment',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item column default value'),
        key: 'columnDefaultValue',
        width: 100,
      },
      {
        type: 'switch',
        title: t('Configuration item editable'),
        key: 'editable',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item display key map'),
        key: 'displayKeyMap',
        width: 100,
      },
      {
        type: 'input',
        title: t('Configuration item value key map'),
        key: 'valueKeyMap',
        width: 100,
      },
      {
        type: 'json',
        title: t('Configuration item edit component props'),
        key: 'editSchema',
        width: 80,
      },
      {
        type: 'json',
        title: t('Configuration item search component props'),
        key: 'searchSchema',
        width: 80,
      },
    ]
    return [
      ...config.map((item) => ({
        title: item.title,
        dataIndex: item.key,
        width: item.width,
        render: (text: string, row: FieldItem) => {
          switch (item.type) {
            case 'input':
              return (
                <Input
                  variant='borderless'
                  size="small"
                  value={(row as any)[item.key]}
                  onChange={(e) => onChangeValue(row.id, item.key, e.currentTarget.value)}
                />
              )
            case 'switch':
              return (
                <Switch
                  defaultChecked
                  onChange={(e) => onChangeValue(row.id, item.key, e)}
                />
              )
            case 'json':
              return (
                <Button
                  type="link"
                  icon={<EditFilled />}
                  onClick={() => {
                    setTmpSelectObj({
                      id: row.id,
                      k: item.key,
                      v: (row as any)[item.key],
                    })
                    setEditJsonOpen(true)
                  }}
                />
              )
            default:
              return <></>
          }
        },
      })),
      {
        title: t('Operation'),
        dataIndex: 'id',
        width: 100,
        render: (text: string, row: FieldItem) => ((row.id?.toString() as string).indexOf('tmp') >= 0 ? (
          <Button
            size="small"
            type="text"
            icon={<CloseOutlined />}
            onClick={() => onClickDeleteTmpField(row.id)}
          >
          </Button>
        ) : (
          <Button
            size="small"
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => onClickDeleteField(row.id)}
          >
          </Button>
        )),
      },
    ]
  }, [onChangeValue, onClickDeleteField, onClickDeleteTmpField, t])

  const onClickAddField = useCallback(() => {
    const tmp = [
      {
        id: `tmp_${v4()}`,
        title: '',
        name: '',
        columnName: '',
        comment: '',
        columnType: '',
        columnDefaultValue: '',
        type: '',
        editable: true,
        editComponent: '',
        extraSchema: {},
        displayKeyMap: '',
        valueKeyMap: '',
      },
      ...(value || []),
    ]
    onChange?.(tmp)
  }, [onChange, value])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const tmp: FieldItem[] = JSON.parse(JSON.stringify(value || []))
      const activeIndex = tmp.findIndex((row) => row.id === active.id)
      const overIndex = tmp.findIndex((row) => row.id === over?.id)
      onChange?.(arrayMove(tmp, activeIndex, overIndex))
    }
  }

  return (
    <>
      <Col>
        <Button size="small" type="primary" onClick={onClickAddField}>
          {t('Add field')}
        </Button>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            // rowKey array
            items={(value || []).map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              rowKey="id"
              components={{
                body: {
                  row: Row,
                },
              }}
              style={{ marginTop: 10 }}
              size="small"
              scroll={{ y: 500 }}
              pagination={false}
              columns={columns}
              dataSource={value}
            />
          </SortableContext>
        </DndContext>
      </Col>
      <Modal
        title={t('Edit json')}
        open={editJsonOpen}
        maskClosable={false}
        onCancel={() => {
          setEditJsonOpen(false)
        }}
        onOk={() => {
          onChangeValue(tmpSelectObj.id, tmpSelectObj.k, tmpSelectObj.v)
          setEditJsonOpen(false)
        }}
      >
        <JsonEditor
          rootName="extraSchema"
          data={tmpSelectObj.v || {}}
          onUpdate={({ newValue }) => {
            setTmpSelectObj({
              id: tmpSelectObj.id,
              k: tmpSelectObj.k,
              v: newValue as any,
            })
          }}
        />
      </Modal>
    </>
  )
}

export default React.memo(Fields)
