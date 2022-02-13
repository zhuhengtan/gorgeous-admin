import './index.less'

import { Button, Form, Input, Switch } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import React from 'react'
import { useTranslation } from 'react-i18next'

import GlobalLan from '@/components/layout/global-lan'

interface Props {
  loading: boolean
  form: FormInstance
  keyDownHandle: (e: any) => Promise<void>
  handlelogin: () => void
  onClickLarkLogin: () => void
}

const PCLogin: React.FC<Props> = (props: Props) => {
  const { form, keyDownHandle, handlelogin, loading, onClickLarkLogin } = props
  const { t } = useTranslation()

  const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  return (
    <div className="pc-container">
      <div className="logo"></div>
      <div className="login-panel">
        <div className="app-name">{t('APP NAME')}</div>
        <div className="panel">
          <div className="language">
            <GlobalLan />
          </div>
          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onKeyDown={keyDownHandle}
          >
            <Form.Item
              {...formItemLayout}
              name="email"
              rules={[
                {
                  required: true,
                  message: t('Please input account'),
                },
              ]}
            >
              <Input placeholder={t('Please input account')} />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="password"
              rules={[
                {
                  required: true,
                  message: t('Please input pwd'),
                },
              ]}
            >
              <Input placeholder={t('Please input pwd')} type="password" />
            </Form.Item>
            <Form.Item name="is_inner" valuePropName="checked">
              <Switch
                checkedChildren={t('Inner user')}
                unCheckedChildren={t('Outer user')}
                defaultChecked
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="login-btn"
                onClick={handlelogin}
                loading={loading}
              >
                {t('Login')}
              </Button>
            </Form.Item>
            <div className="lark-login" onClick={onClickLarkLogin}>
              <img src="https://techcenter-common-storage.123u.com/public/feishu.png" />
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default React.memo(PCLogin)
