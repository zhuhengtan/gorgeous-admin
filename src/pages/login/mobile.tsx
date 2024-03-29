import { Button, Form, Input } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import React from 'react'
import styles from './index.module.less'

interface Props {
  loading: boolean
  form: FormInstance
  keyDownHandle: (e: any) => Promise<void>
  handlelogin: () => void
}

function MobileLogin(props: Props) {
  const {
    form, keyDownHandle, handlelogin, loading,
  } = props

  const formItemLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  return (
    <div className={styles['mobile-container']}>
      <div className={styles.logo}></div>
      <div className={styles['login-panel']}>
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
                message: '请输入账号',
              },
            ]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
          <Form.Item>
            <Button
              className={styles['login-btn']}
              onClick={handlelogin}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default MobileLogin
