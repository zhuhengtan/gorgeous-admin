import {
  Button, Form, Input, Switch,
} from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import React from 'react'
import { useTranslation } from 'react-i18next'

import GlobalLan from '@/components/layout/global-lan'
import styles from './index.module.less'

interface Props {
  loading: boolean
  form: FormInstance
  keyDownHandle: (e: any) => Promise<void>
  handlelogin: () => void
}

const PCLogin: React.FC<Props> = (props: Props) => {
  const {
    form, keyDownHandle, handlelogin, loading,
  } = props
  const { t } = useTranslation()

  const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  return (
    <div className={styles['pc-container']}>
      <div className={styles.logo}></div>
      <div className={styles['login-panel']}>
        <div className={styles['app-name']}>{t('APP NAME')}</div>
        <div className={styles.panel}>
          <div className={styles.language}>
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
            <Form.Item>
              <Button
                className={styles['login-btn']}
                onClick={handlelogin}
                loading={loading}
              >
                {t('Login')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default React.memo(PCLogin)
