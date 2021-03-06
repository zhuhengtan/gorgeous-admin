import { useLocalStorageState } from 'ahooks'
import { Avatar, Dropdown, Menu } from 'antd'
import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { AdminInfo } from '@/type'

const CustomAvatar: FC = () => {
  const { t } = useTranslation()
  const history = useHistory()

  const [, setToken] = useLocalStorageState<string>('TOKEN', {
    defaultValue: '',
  })
  const [adminInfo, setAdminInfo] = useLocalStorageState<AdminInfo | string>(
    'USER_INFO',
    {
      defaultValue: '',
    },
  )

  const goToAdminInfo = useCallback(() => {
    history.push('/admin-info')
  }, [history])

  const logOut = useCallback(() => {
    setToken('')
    setAdminInfo('')
    history.push('/login')
  }, [history, setToken, setAdminInfo])

  const menu = (
    <Menu>
      <Menu.Item key="admin-info" onClick={goToAdminInfo}>
        <span>{t('Admin info')}</span>
      </Menu.Item>
      <Menu.Item key="log-out" onClick={logOut}>
        <a>{t('Logout')}</a>
      </Menu.Item>
    </Menu>
  )
  return (
    <div>
      <Dropdown overlay={menu} placement="bottomCenter">
        {adminInfo && (adminInfo as AdminInfo).avatar ? (
          <Avatar size="default" src={(adminInfo as AdminInfo).avatar} />
        ) : (
          <Avatar
            size="default"
            style={{ color: '#475285', backgroundColor: 'darkgray' }}
          >
            {(adminInfo as AdminInfo).name ? (adminInfo as AdminInfo).name[0] : ''}
          </Avatar>
        )}
      </Dropdown>
    </div>
  )
}

export default CustomAvatar
