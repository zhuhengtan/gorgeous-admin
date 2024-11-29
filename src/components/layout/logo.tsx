import './index.less'

import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'

interface Props {
  collapsed: boolean
}

const Logo = (props: Props) => {
  const navigate = useNavigate()
  const { collapsed } = props

  const goToHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <div
      className={collapsed ? 'collapsed-logo-container' : 'logo-container'}
      onClick={goToHome}
    >
      {!collapsed && <div className="logo" />}
      {collapsed && <div className="logo" />}
    </div>
  )
}

export default React.memo(Logo)
