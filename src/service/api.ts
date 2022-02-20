import { ApiList } from './type'

const apiList: ApiList = {
  login: 'POST /api/b/auth/login',
  getAdminAuth: 'GET /api/b/auth/admin-auth',

  // 用户管理
  getAdmins: 'GET /api/b/auth/admins',
  getAdminDetail: 'GET /api/b/auth/admin',
  addAdmin: 'POST /api/b/auth/admin',
  changeAvatar: 'POST /api/b/auth/admin/update-avatar',
  updateAdmin: 'PUT /api/b/auth/admin',
  deleteAdmin: 'DELETE /api/b/auth/admin',
  getAllRoles: 'GET /api/b/auth/all-roles',
  resetPassword: 'POST /api/b/auth/admin/reset-password',
  sendChangePwdCode: 'POST /api/b/auth/send-change-password-code',
  changePassword: 'POST /api/b/auth/admin/change-password',
  // changeAdminStatus: 'PUT /api/b/forbidden-or-active',

  // 角色权限管理
  getAllOperations: 'GET /api/b/auth/all-operations',
  getRoles: 'GET /api/b/auth/roles',
  getRoleDetail: 'GET /api/b/auth/role',
  addRole: 'POST /api/b/auth/role',
  updateRole: 'PUT /api/b/auth/role',
  deleteRole: 'DELETE /api/b/auth/role',

  // 前端页面管理
  getPageList: 'GET /api/b/auth/pages',
  getPageDetail: 'GET /api/b/auth/page',
  createPage: 'POST /api/b/auth/page',
  updatePage: 'PUT /api/b/auth/page',
  deleteOperation: 'DELETE /api/b/auth/operation',
  deletePage: 'DELETE /api/b/auth/page',
  getAllApis: 'GET /api/b/auth/all-apis',
}

export default apiList
