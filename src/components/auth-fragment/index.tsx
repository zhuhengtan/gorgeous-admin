import React, {
  ReactNode,
  ReactFragment,
  ReactPortal,
  useContext,
} from 'react'

import { AdminAuthContext } from '@/context/AdminAuthContext'

interface Props {
  otherConditions?: boolean
  authKey: string
  children: ReactNode | ReactNode[]
}

const AuthFragment: React.FC<Props> = (props: Props) => {
  const { otherConditions, authKey, children } = props
  const adminAuth = useContext(AdminAuthContext)
  const haveAuth = adminAuth[(window?.microApp?.location || window.location).pathname]
    && adminAuth[(window?.microApp?.location || window.location).pathname].filter((item) => item.operationKey === authKey).length > 0

  return <>{otherConditions && haveAuth && children}</>
}

AuthFragment.defaultProps = {
  otherConditions: true,
}

export default React.memo(AuthFragment)
