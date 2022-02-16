import './index.less'

import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

interface Props {
  collapsed: boolean
}

const Logo = (props: Props) => {
  const history = useHistory()
  const { collapsed } = props

  const goToHome = useCallback(() => {
    history.push('/')
  }, [history])

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
