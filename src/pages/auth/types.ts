export interface Operation {
  id?: number | string
  name: string
  key: string
  relatedApis: string[]
  createdAt?: string
}

export interface FieldItem {
  id: string
  title: string
  name: string
  type: string
  columnName: string
  comment: string
  columnType: string
  columnDefaultValue: string | number | boolean
  editable: boolean
  editComponent: string
}

export interface Page {
  id: number
  name: string
  path: string
  createdAt: string
  operations: Operation[]
  content: FieldItem[] | null
}

export interface Role {
  id: number
  name: string
  description: string
  Operations: []
}

export interface Admin {
  id: number
  name: string
  adminType: number
  status: number
  avatar: string
  createdAt: string
  email: string
  roles: Role[]
}
