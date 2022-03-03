import React from 'react'

interface Props {
  path: string
  pageType: number
}

const RouteConfigure: React.FC<Props> = (props: Props) => {
  const { path, pageType } = props
  return <></>
}

export default React.memo(RouteConfigure)
