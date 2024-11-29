import { useLocalStorageState } from 'ahooks'
import { Avatar, Dropdown, Menu } from 'antd'
import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { AdminInfo } from '@/type'

const CustomAvatar: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

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
    navigate('/admin-info')
  }, [navigate])

  const logOut = useCallback(() => {
    setToken('')
    setAdminInfo('')
    navigate('/login')
  }, [navigate, setToken, setAdminInfo])

  const menuItems = useMemo(() => ([
    {
      label: t('Admin info'),
      key: 'admin-info',
      onClick: goToAdminInfo,
    },
    {
      label: t('Logout'),
      key: 'log-out',
      onClick: logOut,
    },
  ]), [goToAdminInfo, logOut, t])
  return (
    <div>
      <Dropdown menu={{ items: menuItems }} placement="bottom">
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
