import React, {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useContext,
} from 'react'

import { AdminAuthContext } from '@/context/AdminAuthContext'

type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined

interface Props {
  otherConditions?: boolean
  authKey: string
  children: ReactNode | ReactNode[]
}

const AuthFragment: React.FC<Props> = (props: Props) => {
  const { otherConditions, authKey, children } = props
  const adminAuth = useContext(AdminAuthContext)
  const haveAuth = adminAuth[window.location.pathname]
    && adminAuth[window.location.pathname].indexOf(authKey) >= 0

  return <>{otherConditions && haveAuth && children}</>
}

AuthFragment.defaultProps = {
  otherConditions: true,
}

export default React.memo(AuthFragment)
