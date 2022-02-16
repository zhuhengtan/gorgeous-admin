import './index.less'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useLocalStorageState, useRequest } from 'ahooks'
import {
  Button, Col, Form, Input, message, Modal, Row, Upload,
} from 'antd'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import { getCookie } from '@/utils/cookie'
import api from '@/service'
import { UserInfo } from '@/type'

const {
  changePassword: changePasswordRequest,
  changeAvatar: changeAvatarRequest,
} = api

const UserInfoComponent: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [, setToken] = useLocalStorageState<string>('TOKEN', {
    defaultValue: '',
  })
  const [user, setUser] = useLocalStorageState<UserInfo>('USER_INFO', {
    defaultValue: {
      id: 0,
      name: '',
      email: '',
      user_type: 1,
      avatar: '',
      status: 0,
    },
  })

  const [showFormDialog, setShowFormDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  }
  const formLayout = { wrapperCol: { span: 14, offset: 4 } }
  const { run: changePassword } = useRequest(
    (data) => changePasswordRequest(data),
    {
      manual: true,
      onSuccess() {
        setToken('')
        setUser({
          id: 0,
          name: '',
          email: '',
          user_type: 1,
          avatar: '',
          status: 0,
        })
        history.push('/login')
      },
    },
  )

  const { run: changeAvatar } = useRequest(
    (data) => changeAvatarRequest(data),
    {
      manual: true,
      onSuccess() {},
    },
  )

  // 修改密码
  const submitChangePassword = useCallback(async () => {
    const fields = form.getFieldsValue()
    if (user && user.id) {
      changePassword({
        id: user.id,
        old_password: fields.old_password,
        new_password: fields.new_password,
      })
    }
  }, [form, changePassword, user])

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  return (
    <div>
      <Row justify="center" align="top">
        <Col span={2} pull={2} className="title">
          {t('Base info')}
        </Col>
        <Col span={3} style={{ borderBottom: '1px solid #ddd' }}>
          <Row className="item-label">{t('Avatar')}</Row>
          <Row className="item-content">
            <Col>
              <Upload
                withCredentials
                listType="picture-card"
                showUploadList={false}
                action="/api/upload"
                headers={{
                  authorization: `${getCookie('token')}`,
                }}
                onChange={(info: any) => {
                  if (info.file.status === 'uploading') {
                    setLoading(true)
                    return
                  }
                  if (info.file.status === 'done') {
                    message.success(`${info.file.name} ${t('Upload success')}`)
                    changeAvatar({
                      id: user.id,
                      avatar_url: info.file.response.data,
                    })
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} ${t('Upload fail')}`)
                  }
                  setLoading(false)
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Col>
            <Col span={1} push={24}>
              {/* <Button type="link" onClick={() => setShowAvaFormDialog(true)}>
                修改
              </Button> */}
            </Col>
          </Row>
          <Row className="item-label">{t('Username')}</Row>
          <Row className="item-content">{user.name}</Row>
          <Row className="item-label">{t('Email')}</Row>
          <Row className="item-content">{user.email}</Row>
          <Row className="item-label">{t('User type')}</Row>
          <Row className="item-content">
            {user.user_type === 1 ? t('Inner user') : t('Outer user')}
          </Row>
        </Col>
      </Row>
      <Row justify="center" align="top" style={{ marginTop: '40px' }}>
        <Col span={2} pull={2} className="title">
          {t('Account secure')}
        </Col>
        <Col span={3} style={{ borderBottom: '1px solid #ddd' }}>
          <Row className="item-label">{t('Password')}</Row>
          <Row className="item-content">
            <Col>******</Col>
            {user.user_type === 2 && (
              <Col span={1} push={24}>
                <Button
                  type="link"
                  onClick={() => {
                    setShowFormDialog(true)
                  }}
                >
                  {t('Edit password')}
                </Button>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      <Modal
        title={t('Edit password')}
        visible={showFormDialog}
        onOk={submitChangePassword}
        onCancel={() => setShowFormDialog(false)}
      >
        <Form
          {...formItemLayout}
          layout="horizontal"
          form={form}
          initialValues={{ layout: formLayout }}
        >
          <Form.Item
            label={t('Old password')}
            name="old_password"
            rules={[
              {
                required: true,
                message: t('Please input old password'),
              },
            ]}
          >
            <Input
              type="password"
              placeholder={t('Please input old password')}
            />
          </Form.Item>
          <Form.Item
            label={t('New password')}
            name="new_password"
            rules={[
              {
                required: true,
                message: t('Password regex tips'),
                pattern: /^(?![A-Za-z]+$)(?![0-9]+$)[\w!@#$%^&*_-]{8,}$/,
              },
            ]}
          >
            <Input
              type="password"
              placeholder={t('Please input new password')}
            />
          </Form.Item>
          <Form.Item
            label={t('Confirm password')}
            name="new_password2"
            rules={[
              {
                required: true,
                message: t('Password regex tips'),
                pattern: /^(?![A-Za-z]+$)(?![0-9]+$)[\w!@#$%^&*_-]{8,}$/,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(
                      t('The two passwords that you entered do not match'),
                    ),
                  )
                },
              }),
            ]}
          >
            <Input
              type="password"
              placeholder={t('Please enter the password again')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default React.memo(UserInfoComponent)
