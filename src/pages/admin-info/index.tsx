import './index.less'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useLocalStorageState, useRequest, useCountDown } from 'ahooks'
import {
  Button, Col, Form, Input, message, Modal, Row, Upload, Space,
} from 'antd'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import { getCookie } from '@/utils/cookie'
import api from '@/service'
import { AdminInfo } from '@/type'
import { showMessage } from '@/utils'

const {
  changePassword: changePasswordRequest,
  changeAvatar: changeAvatarRequest,
  sendChangePwdCode: sendChangePwdCodeRequest,
} = api

const AdminInfoComponent: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [, setToken] = useLocalStorageState<string>('TOKEN', {
    defaultValue: '',
  })
  const [admin, setAdmin] = useLocalStorageState<AdminInfo>('USER_INFO', {
    defaultValue: {
      id: 0,
      name: '',
      email: '',
      adminType: 1,
      avatar: '',
      status: 0,
    },
  })

  const [showFormDialog, setShowFormDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [targetDate, setTargetDate] = useLocalStorageState<number>('CHANGE_PWD_CODE')

  const [countdown] = useCountDown({
    targetDate,
  })

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
        setAdmin({
          id: 0,
          name: '',
          email: '',
          adminType: 1,
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
      onSuccess() { },
    },
  )

  const { run: sendChangePwd } = useRequest(() => sendChangePwdCodeRequest({ email: admin.email }), {
    manual: true,
    onSuccess() {
      showMessage(t('Get email code success'))
      setTargetDate(Date.now() + 60 * 5 * 1000)
    },
  })

  // 修改密码
  const submitChangePassword = useCallback(async () => {
    const fields = form.getFieldsValue()
    if (admin && admin.id) {
      changePassword({
        email: fields.email,
        code: fields.code,
        newPassword: fields.newPassword,
      })
    }
  }, [form, changePassword, admin])

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  return (
    <>
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
                      id: admin.id,
                      avatar_url: info.file.response.data,
                    })
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} ${t('Upload fail')}`)
                  }
                  setLoading(false)
                }}
              >
                {admin.avatar ? (
                  <img
                    src={admin.avatar}
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
          <Row className="item-label">{t('Adminname')}</Row>
          <Row className="item-content">{admin.name}</Row>
          <Row className="item-label">{t('Email')}</Row>
          <Row className="item-content">{admin.email}</Row>
          <Row className="item-label">{t('Admin type')}</Row>
          <Row className="item-content">
            {admin.adminType === 1 ? t('System admin') : t('Created admin')}
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
            <Col span={1} push={24}>
              <Button
                type="link"
                onClick={() => {
                  setShowFormDialog(true)
                  form.setFieldsValue({
                    email: admin.email,
                    code: '',
                    newPassword: '',
                  })
                }}
              >
                {t('Edit password')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title={t('Edit password')}
        visible={showFormDialog}
        maskClosable={false}
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
            label={t('Email')}
            name="email"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={t('Email code')}
            name="code"
            rules={[
              {
                required: true,
                message: t('Please input email code'),
              },
            ]}
          >
            <Space>
              <Input
                placeholder={t('Please input email code')}
              />
              <Button
                type="primary"
                disabled={countdown > 0}
                onClick={sendChangePwd}
              >
                {countdown === 0 ? t('Get email code') : t('Get email code again', { countdown: Math.round(countdown / 1000) })}
              </Button>
            </Space>
          </Form.Item>
          <Form.Item
            label={t('Password')}
            name="newPassword"
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
              placeholder={t('Please input pwd')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default React.memo(AdminInfoComponent)
