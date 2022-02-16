import { ApiList } from './type'

const apiList: ApiList = {
  login: 'POST /api/auth/login',
  loginByLark: 'POST /api/login-feishu',

  // 用户管理
  getUsers: 'GET /api/users',
  getHuanleUsers: 'GET /api/departments',
  addUser: 'POST /api/user',
  getPersonalDetail: 'GET /api/login-user',
  resetPassword: 'PUT /api/reset-password',
  changePassword: 'PUT /api/change-password',
  changeUserStatus: 'PUT /api/forbidden-or-active',
  changeAvatar: 'PUT /api/change-avatar',
  changeSetting: 'PUT /api/user/setting',
  removeUser: 'PUT /api/user/remove',
  updateUserRole: 'PUT /api/user/role',

  // 角色权限管理
  getRole: 'GET /api/role',
  getAuth: 'GET /api/role/elements',
  getRoles: 'GET /api/roles',
  addRole: 'POST /api/role',
  updateRole: 'PUT /api/role',
  deleteRole: 'DELETE /api/role',
  getUserAuth: 'GET /api/auth/user-auth',
}

export default apiList
