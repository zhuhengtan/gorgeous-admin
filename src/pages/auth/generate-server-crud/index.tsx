import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Form, { useForm, FRProps } from 'form-render'
import api from '@/service'
import { Button } from 'antd'
import { useRequest } from 'ahooks'
import AuthFragment from '@/components/auth-fragment'
import Field from './field'

const {
  generateServerCrud: generateServerCrudRequest,
} = api

const GenerateServerCRUD: React.FC = () => {
  const { t } = useTranslation()
  const form = useForm()

  const {
    run: generateServerCrud,
  } = useRequest((data) => generateServerCrudRequest(data), {
    manual: true,
    onSuccess() {
      form.resetFields()
    },
  })

  const schema = useMemo<FRProps['schema']>(() => ({
    type: 'object',
    properties: {
      entityName: {
        type: 'string',
        hidden: '{{ formData.pageType === 0 }}',
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
  }), [t])

  const submit = useCallback(() => {
    const data = form.getValues()
    generateServerCrud(data)
  }, [generateServerCrud, form])

  return (
    <>
      <Form
        form={form}
        schema={schema}
        widgets={{
          field: Field,
        }}
      />
      <AuthFragment authKey="create">
        <Button type="primary" onClick={submit}>{t('Submit')}</Button>
      </AuthFragment>
    </>
  )
}

export default React.memo(GenerateServerCRUD)
