import { useRequest } from 'ahooks'
import {
  Checkbox,
  Form, Input, Modal, Radio, Select, Switch, Tabs, TreeSelect,
} from 'antd'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/service'
import { cloneDeep } from 'lodash'
import { Role } from '../types'

const {
  getUserDetail: getUserDetailRequest,
  addUser: addUserRequest,
  updateUser: updateUserRequest,
  getAllRoles: getAllRolesRequest,
} = api

interface Props {
  id: number
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  onSuccess?: () => void
}

const AddUserForm: React.FC<Props> = (props: Props) => {
  const {
    id, visible, setVisible, onSuccess,
  } = props
  const { t } = useTranslation()

  const [form] = Form.useForm()
  const [roleList, setRoleList] = useState<Role[]>([])

  const { run: addUser, loading: addLoading } = useRequest(
    (data) => addUserRequest(data),
    {
      manual: true,
      onSuccess() {
        form.resetFields()
        if (onSuccess) {
          onSuccess()
        }
        setVisible(false)
      },
    },
  )

  const { run: updateUser, loading: updateLoading } = useRequest(
    (data) => updateUserRequest(data),
    {
      manual: true,
      onSuccess() {
        form.resetFields()
        if (onSuccess) {
          onSuccess()
        }
        setVisible(false)
      },
    },
  )

  const { run: getUserDetail, loading: getLoading } = useRequest((id) => getUserDetailRequest({ id }), {
    manual: true,
    onSuccess(res) {
      const formData: any = cloneDeep(res)
      formData.roleIds = formData.roles.map((role: Role) => (role.id))
      form.setFieldsValue(formData)
    },
  })

  const { run: getAllRoles, loading: getRoleLoading } = useRequest(
    () => getAllRolesRequest(),
    {
      manual: true,
      onSuccess(e: Role[]) {
        setRoleList(e)
      },
    },
  )

  const handleCancel = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onClickConfirm = useCallback(async () => {
    await form.validateFields()
    const data = form.getFieldsValue()
    if (id) {
      updateUser(data)
    } else {
      addUser(data)
    }
  }, [addUser, form, id, updateUser])

  useEffect(() => {
    if (id) {
      getUserDetail(id)
      getAllRoles()
    }
  }, [getAllRoles, getUserDetail, id])

  return (
    <Modal
      title={t('Add user')}
      visible={visible}
      onCancel={handleCancel}
      onOk={onClickConfirm}
      confirmLoading={addLoading || updateLoading}
    >
      <Form
        form={form}
        name="control-hooks"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item hidden name="id">
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('Username')}
          rules={[{ required: true, message: t('Please input username') }]}
        >
          <Input
            placeholder={t('Please input username')}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label={t('Status')}
        >
          <Radio.Group>
            <Radio value={1}>{t('Enable')}</Radio>
            <Radio value={0}>{t('Disable')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="email"
          label={t('Email')}
          rules={[
            {
              required: true,
              type: 'email',
              message: t('Please input email'),
            },
          ]}
        >
          <Input
            placeholder={t('Please input email')}
          />
        </Form.Item>
        <Form.Item name="roleIds" label={t('Role')}>
          <Select
            placeholder={t('Role')}
            mode="multiple"
            loading={getRoleLoading}
            onFocus={() => {
              if (!id) {
                getAllRoles()
              }
            }}
          >
            {roleList.map((role: Role) => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

AddUserForm.defaultProps = {
  onSuccess: () => {},
}

export default React.memo(AddUserForm)
