import React, {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useContext,
  useEffect,
} from 'react'

import { UserAuthContext } from '@/context/UserAuthContext'

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
  const userAuth = useContext(UserAuthContext)
  const haveAuth =
    userAuth[window.location.pathname] &&
    userAuth[window.location.pathname].indexOf(authKey) >= 0

  return <>{otherConditions && haveAuth && children}</>
}

AuthFragment.defaultProps = {
  otherConditions: true,
}

export default React.memo(AuthFragment)
