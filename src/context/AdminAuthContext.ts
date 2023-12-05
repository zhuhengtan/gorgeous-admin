import React from 'react'

export interface AdminAuth {
  [page: string]: {
    operationKey: string
    operationName: string
    relatedApi: string
  }[]
}

export const AdminAuthContext = React.createContext<AdminAuth>({})
