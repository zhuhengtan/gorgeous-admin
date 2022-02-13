import React from 'react'

export interface UserAuth {
  [page: string]: string[]
}

export const UserAuthContext = React.createContext<UserAuth>({})
