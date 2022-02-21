import React from 'react'

export interface AdminAuth {
  [page: string]: {
    operationKey: string
    operationName: string
  }[]
}

export const AdminAuthContext = React.createContext<AdminAuth>({})
