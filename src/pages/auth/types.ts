export interface Operation {
  id?: number | string
  name: string
  key: string
  relatedApi: string
  createdAt?: string
}

export interface Page {
  id: number
  name: string
  path: string
  createdAt: string
  operations: Operation[]
}

export interface Role {
  id: number
  name: string
  description: string
  Operations: []
}

export interface User {
  id: number
  name: string
  userType: number
  status: number
  avatar: string
  createdAt: string
  email: string
  roles: Role[]
}
