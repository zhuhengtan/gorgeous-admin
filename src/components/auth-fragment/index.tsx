import React, {
  ReactNode,
} from 'react'

import { useAllAuth } from '@/context/auth-context-provider'

interface Props {
  otherConditions?: boolean
  authKey: string
  children: ReactNode | ReactNode[]
}

const AuthFragment: React.FC<Props> = (props: Props) => {
  const { otherConditions, authKey, children } = props
  const allAuth = useAllAuth()
  const haveAuth = allAuth[window.location.pathname]
    && allAuth[window.location.pathname].filter((item) => item.operationKey === authKey).length > 0

  return <>{otherConditions && haveAuth && children}</>
}

AuthFragment.defaultProps = {
  otherConditions: true,
}

export default React.memo(AuthFragment)
