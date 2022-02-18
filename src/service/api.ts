import { ApiList } from './type'

const apiList: ApiList = {
  login: 'POST /api/auth/login',
  getUserAuth: 'GET /api/auth/user-auth',

  // 用户管理
  getUsers: 'GET /api/auth/users',
  getUserDetail: 'GET /api/auth/user',
  addUser: 'POST /api/auth/user',
  changeAvatar: 'POST /api/auth/user/update-avatar',
  updateUser: 'PUT /api/auth/user',
  deleteUser: 'DELETE /api/auth/user',
  getAllRoles: 'GET /api/auth/all-roles',
  resetPassword: 'POST /api/auth/user/reset-password',
  // changePassword: 'PUT /api/change-password',
  // changeUserStatus: 'PUT /api/forbidden-or-active',

  // 角色权限管理
  getAllOperations: 'GET /api/auth/all-operations',
  getRoles: 'GET /api/auth/roles',
  getRoleDetail: 'GET /api/auth/role',
  addRole: 'POST /api/auth/role',
  updateRole: 'PUT /api/auth/role',
  deleteRole: 'DELETE /api/auth/role',

  // 前端页面管理
  getPageList: 'GET /api/auth/pages',
  getPageDetail: 'GET /api/auth/page',
  createPage: 'POST /api/auth/page',
  updatePage: 'PUT /api/auth/page',
  deleteOperation: 'DELETE /api/auth/operation',
  deletePage: 'DELETE /api/auth/page',
  getAllApis: 'GET /api/auth/all-apis',
}

export default apiList
