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
  getAdminDetail: getAdminDetailRequest,
  addAdmin: addAdminRequest,
  updateAdmin: updateAdminRequest,
  getAllRoles: getAllRolesRequest,
} = api

interface Props {
  id: number
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  onSuccess?: () => void
}

const AddAdminForm: React.FC<Props> = (props: Props) => {
  const {
    id, visible, setVisible, onSuccess,
  } = props
  const { t } = useTranslation()

  const [form] = Form.useForm()
  const [roleList, setRoleList] = useState<Role[]>([])

  const { run: addAdmin, loading: addLoading } = useRequest(
    (data) => addAdminRequest(data),
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

  const { run: updateAdmin, loading: updateLoading } = useRequest(
    (data) => updateAdminRequest(data),
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

  const { run: getAdminDetail, loading: getLoading } = useRequest((id) => getAdminDetailRequest({ id }), {
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
      updateAdmin(data)
    } else {
      addAdmin(data)
    }
  }, [addAdmin, form, id, updateAdmin])

  useEffect(() => {
    if (id) {
      getAdminDetail(id)
      getAllRoles()
    }
  }, [getAllRoles, getAdminDetail, id])

  return (
    <Modal
      title={t('Add admin')}
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
          label={t('Adminname')}
          rules={[{ required: true, message: t('Please input adminname') }]}
        >
          <Input
            placeholder={t('Please input adminname')}
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

AddAdminForm.defaultProps = {
  onSuccess: () => {},
}

export default React.memo(AddAdminForm)
