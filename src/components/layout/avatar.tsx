import { useLocalStorageState } from 'ahooks'
import { Avatar, Dropdown, Menu } from 'antd'
import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { UserInfo } from '@/type'

const CustomAvatar: FC = () => {
  const { t } = useTranslation()
  const history = useHistory()

  const [, setToken] = useLocalStorageState<string>('TOKEN', {
    defaultValue: '',
  })
  const [userInfo, setUserInfo] = useLocalStorageState<UserInfo | string>(
    'USER_INFO',
    {
      defaultValue: '',
    },
  )

  const goToUserInfo = useCallback(() => {
    history.push('/user-info')
  }, [history])

  const logOut = useCallback(() => {
    setToken('')
    setUserInfo('')
    history.push('/login')
  }, [history, setToken, setUserInfo])

  const menu = (
    <Menu>
      <Menu.Item key="user-info" onClick={goToUserInfo}>
        <span>{t('User info')}</span>
      </Menu.Item>
      <Menu.Item key="log-out" onClick={logOut}>
        <a>{t('Logout')}</a>
      </Menu.Item>
    </Menu>
  )
  return (
    <div>
      <Dropdown overlay={menu} placement="bottomCenter">
        {userInfo && (userInfo as UserInfo).avatar ? (
          <Avatar size="default" src={(userInfo as UserInfo).avatar} />
        ) : (
          <Avatar
            size="default"
            style={{ color: '#475285', backgroundColor: 'darkgray' }}
          >
            {(userInfo as UserInfo).name ? (userInfo as UserInfo).name[0] : ''}
          </Avatar>
        )}
      </Dropdown>
    </div>
  )
}

export default CustomAvatar
