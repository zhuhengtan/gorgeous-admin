import { GlobalOutlined } from '@ant-design/icons'
import { useLocalStorageState } from 'ahooks'
import {
  Dropdown, MenuProps,
} from 'antd'
import React, { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { languageMap } from '@/utils'

const GlobalLan: FC = () => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useLocalStorageState('LANGUAGE', {
    defaultValue: 'zh',
  })
  const changeHandle = useCallback(
    (lan: string) => {
      i18n.changeLanguage(lan)
      setLanguage(lan)
    },
    [i18n, setLanguage],
  )

  const languageMenuItems = useMemo<MenuProps['items']>(() => Object.keys(languageMap).map((key) => (
    {
      label: (languageMap as any)[key].name,
      key,
      onClick: () => changeHandle(key),
    }
  )), [changeHandle])

  return (
    <Dropdown menu={{ items: languageMenuItems }} placement="bottom">
      <div className="language-selecter">
        <GlobalOutlined
          style={{ color: 'black', fontSize: 18, display: 'block' }}
        />
        <span className="name">{(languageMap as any)[language!].name}</span>
      </div>
    </Dropdown>
  )
}

export default GlobalLan
