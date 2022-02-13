import { useRequest } from 'ahooks'
import { Form, Input, Modal, Select, Tabs, TreeSelect } from 'antd'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import api from '@/service'

const { TabPane } = Tabs

const {
  getHuanleUsers: getHuanleUsersRequest,
  addUser: addUserRequest,
  getRoles: getRoleListRequest,
} = api

interface AddUserParams {
  name: string
  email: string
  user_type: string
  avatar?: string
  role_id: number
}

interface Props {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  onSuccess?: () => void
}

interface UserData {
  name: string
  email: string
  user_type: string
  avatar: string
  role_id: number
}

interface Role {
  id: number
  name: string
}

const AddUserForm: React.FC<Props> = (props: Props) => {
  const { visible, setVisible, onSuccess } = props
  const { t } = useTranslation()

  const [form] = Form.useForm()
  const [huanleUsers, setHuanleUsers] = useState()
  const [roleList, setRoleList] = useState([])
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    user_type: '1',
    avatar: '',
    role_id: 0,
  })

  const transformTreeData = useCallback((oldTree: any) => {
    const newTree: any = []
    oldTree.map((item: any) =>
      newTree.push({
        title: item.name,
        value: item.uid ? item.department_id + item.uid : item.org_id,
        children:
          item.child_dept || item.dept_users_info
            ? transformTreeData([...item.child_dept, ...item.dept_users_info])
            : [],
        selectable: !item.org_id,
        data: item,
      })
    )
    return newTree
  }, [])

  const { run: getHuanleUsers, loading: getHuanleUsersLoading } = useRequest(
    () => getHuanleUsersRequest(),
    {
      manual: true,
      refreshOnWindowFocus: false,
      onSuccess(e) {
        setHuanleUsers(transformTreeData(e.data))
      },
    }
  )
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
    }
  )

  const { run: getRoleList, loading: getRoleLoading } = useRequest(
    () => getRoleListRequest(),
    {
      manual: true,
      onSuccess(e) {
        setRoleList(e.list)
      },
    }
  )

  const handleCancel = useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const handleTreeSelect = useCallback(
    (v) => {
      const getUserInfo = (departs: any) => {
        departs.forEach((item: any) => {
          if (Array.isArray(item.children) && item.children.length > 0) {
            getUserInfo(item.children)
          }
          if (item.value === v) {
            const tmp = userData
            tmp.name = item.data.name
            tmp.email = item.data.email
            tmp.avatar = item.data.avatar
            tmp.user_type = '1'
            setUserData(tmp)
          }
        })
      }
      getUserInfo(huanleUsers)
    },
    [huanleUsers, userData]
  )

  const onChangeValue = useCallback(
    (key, value) => {
      const tmp: UserData = userData
      ;(tmp as any)[key] = value
      setUserData(tmp)
    },
    [userData]
  )

  const onClickConfirm = useCallback(async () => {
    await form.validateFields()
    addUser(userData)
  }, [addUser, form, userData])

  return (
    <Modal
      title={t('Add user')}
      visible={visible}
      onCancel={handleCancel}
      onOk={onClickConfirm}
      confirmLoading={addLoading}
    >
      <Form
        form={form}
        name="control-hooks"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
      >
        <Tabs
          defaultActiveKey="1"
          onChange={(v) => onChangeValue('user_type', v)}
        >
          <TabPane tab={t('Inner user')} key="1">
            <Form.Item
              name="innerUser"
              label={t('User')}
              rules={[{ required: true, message: t('Please select user') }]}
            >
              <TreeSelect
                onFocus={() => getHuanleUsers()}
                loading={getHuanleUsersLoading}
                fieldNames={{
                  label: 'title',
                  value: 'value',
                }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={huanleUsers}
                placeholder={t('Please select user')}
                showSearch
                treeNodeFilterProp="title"
                onChange={handleTreeSelect}
              />
            </Form.Item>
          </TabPane>
          <TabPane tab={t('Outer user')} key="2">
            <Form.Item
              name="name"
              label={t('Username')}
              rules={[{ required: true, message: t('Please input username') }]}
            >
              <Input
                placeholder={t('Please input username')}
                onChange={(e) => onChangeValue('name', e.currentTarget.value)}
              />
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
                onChange={(e) => onChangeValue('email', e.currentTarget.value)}
              />
            </Form.Item>
          </TabPane>
        </Tabs>
        <Form.Item name="role_id" label={t('Role')}>
          <Select
            placeholder={t('Role')}
            loading={getRoleLoading}
            onFocus={() => getRoleList()}
            onChange={(e) => onChangeValue('role_id', e)}
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
