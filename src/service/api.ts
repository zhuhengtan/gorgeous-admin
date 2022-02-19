import { ApiList } from './type'

const apiList: ApiList = {
  login: 'POST /api/auth/login',
  getAdminAuth: 'GET /api/auth/admin-auth',

  // 用户管理
  getAdmins: 'GET /api/auth/admins',
  getAdminDetail: 'GET /api/auth/admin',
  addAdmin: 'POST /api/auth/admin',
  changeAvatar: 'POST /api/auth/admin/update-avatar',
  updateAdmin: 'PUT /api/auth/admin',
  deleteAdmin: 'DELETE /api/auth/admin',
  getAllRoles: 'GET /api/auth/all-roles',
  resetPassword: 'POST /api/auth/admin/reset-password',
  // changePassword: 'PUT /api/change-password',
  // changeAdminStatus: 'PUT /api/forbidden-or-active',

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
