import React from 'react'

export interface AdminAuth {
  [page: string]: string[]
}

export const AdminAuthContext = React.createContext<AdminAuth>({})
