import { GlobalOutlined } from '@ant-design/icons'
import { useLocalStorageState } from 'ahooks'
import { Dropdown, Menu, Space } from 'antd'
import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { languageMap } from '@/utils'

const GlobalLan: FC = () => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useLocalStorageState('LANGUAGE', 'zh')
  const changeHandle = useCallback(
    (lan: string) => {
      i18n.changeLanguage(lan)
      setLanguage(lan)
    },
    [i18n, setLanguage]
  )

  const menu = (
    <Menu>
      {Object.keys(languageMap).map((key) => (
        <Menu.Item key={key}>
          <a onClick={() => changeHandle(key)}>
            {(languageMap as any)[key].name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <div className="language-selecter">
        <GlobalOutlined
          style={{ color: 'black', fontSize: 18, display: 'block' }}
        />
        <span className="name">{(languageMap as any)[language].name}</span>
      </div>
    </Dropdown>
  )
}

export default GlobalLan
