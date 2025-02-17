import React, { useMemo, useState } from 'react'
import { Button, Modal } from 'antd'
import { useRequest } from 'ahooks'
import APIFunction from '@/service'
import Form, { useForm, FRProps } from 'form-render'
import { useTranslation } from 'react-i18next'
import Field from './field'

interface Props {
  children?: React.ReactNode
  isEdit?: boolean
  record?: any
  onCreateSuccess?: ()=>void
  onUpdateSuccess?: ()=>void
  buttonContainerStyle?: React.CSSProperties,
}

const EditGeneratedPageModal:React.FC<Props> = (props: Props) => {
  const { t } = useTranslation()
  const {
    children, isEdit = false, record, onCreateSuccess, onUpdateSuccess, buttonContainerStyle,
  } = props
  const [open, setOpen] = useState<boolean>(false)
  const form = useForm()

  const { run: generateServerCrud } = useRequest(
    (data) => APIFunction.generateServerCrud(data),
    {
      manual: true,
      onSuccess() {
        setOpen(false)
        form.resetFields()
        onCreateSuccess?.()
      },
    },
  )

  const { run: updateGeneratedEntity } = useRequest(
    (data) => APIFunction.updateGeneratedEntity(data),
    {
      manual: true,
      onSuccess() {
        setOpen(false)
        form.resetFields()
        onUpdateSuccess?.()
      },
    },
  )

  const schema = useMemo<FRProps['schema']>(
    () => ({
      type: 'object',
      properties: {
        id: {
          title: 'ID',
          type: 'number',
          hidden: !isEdit,
          readOnly: true,
        },
        entityName: {
          type: 'string',
          hidden: '{{ formData.pageType === 0 }}',
          readOnly: isEdit,
          title: t('Page entity name'),
          placeholder: t('Page entity placeholder'),
        },
        fields: {
          type: 'array',
          hidden: '{{ formData.pageType === 0 }}',
          title: t('Page fields'),
          widget: 'field',
        },
      },
    }),
    [isEdit, t],
  )

  return (
    <>
      {children ? (
        <div
          style={buttonContainerStyle || {}}
          onClick={() => {
            setOpen(true)
            form.setValues(record)
          }}
        >{children}
        </div>
      ) : (
        <Button
          size="small"
          type="primary"
          onClick={() => {
            setOpen(true)
            form.setValues(record)
          }}
        >
          {isEdit ? t('Edit') : t('Create')}
        </Button>
      )}
      <Modal
        width="80%"
        forceRender
        title={isEdit ? t('Edit') : t('Create')}
        open={open}
        maskClosable={false}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        onOk={() => {
          form.submit()
        }}
      >
        <Form
          form={form}
          schema={schema}
          widgets={{
            field: Field,
          }}
          onFinish={(e) => {
            console.log(e)
            if (e.id) {
              updateGeneratedEntity(e)
            } else {
              generateServerCrud(e)
            }
          }}
        />
      </Modal>
    </>
  )
}

export default React.memo(EditGeneratedPageModal)
