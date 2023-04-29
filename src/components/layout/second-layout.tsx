import React, { FC, useState } from 'react'
import { Outlet, RouteObject } from 'react-router'

const SecondLayout: FC = (props: RouteObject) => {
  const [a] = useState(0)
  return (
    <Outlet />
  )
}

export default React.memo(SecondLayout)
