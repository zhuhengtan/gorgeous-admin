# 前端

## 基本说明

* 项目是用[create-react-app](https://github.com/facebook/create-react-app)初始化的，使用其内置的打包
* 使用[craco](https://github.com/gsoft-inc/craco)配置`webpack`
* 使用[env-cmd](https://github.com/toddbluhm/env-cmd)控制编译环境
* 使用[ant-design](https://ant.design/docs/react/introduce-cn)作为UI框架
* 使用`context`进行状态管理
* 使用第三方hooks包[ahooks](https://ahooks.js.org/zh-CN)

## 前端权限

后端根据请求的用户拿到权限，返回给前端该用户所有的页面权限以及对应页面所有的操作权限列表，每个操作权限有对应的Key。前端通过比对本地路由文件中需要鉴权的页面与后端给到的页面列表，展示侧边栏，此功能在`src/components/layout`中；通过判断页面模块中的key是否存在于后端给的页面中的操作权限列表中，来判断是否渲染对应组件，此功能由`src/components/auth-fragment`中的`AuthFragment`组件实现。

## 规范

### 代码规范

- 具体代码有eslint检查空格换行以及一些基础的代码样式
- 文件夹和文件名使用短横线命名（kebab-case）
- 组件名、类名（type）、接口名（interface）用大驼峰（PascalCase）
- 变量、函数采用小驼峰（camelCase）
- 常量采用大蛇形（CONSTANT_VALUE）

### 开发规范

- `ts/tsx`中尽量避免使用`any`
- 禁止循环生成节点时不加key
- 禁止循环引用，请解构数据结构并将公用类型提取到独立文件
- 避免使用for-in，forEach遍历，建议使用for-of替代
- 避免行内样式的使用
- 避免用于调试的console的滥用，可采取更为科学的控制台调试
- 避免提交注释代码

### 提交规范

- feat: 新功能（feature）
- fix: 修补 bug
- docs: 文档
- style: 样式变更，不影响代码运行
- refactor: 代码重构，既不是新增功能，也不是修改 bug；比方说修改一种写法，或者优化代码，或者使用 prettier 优化代码的结构，都属于这种
- test: 增加测试
- chore: 构建过程或者辅助工具的变更，如 webpack 配置变更等

### 版本规范

所有涉及到版本发布的项目应用需严格遵循 Semantic Versioning 2.0.0 语义化版本规范。

版本格式：主版本号.次版本号.修订号，版本号递增规则如下：

1. 主版本号：当你做了不兼容的 API 修改，
2. 次版本号：当你做了向下兼容的功能性新增，
3. 修订号：当你做了向下兼容的问题修正。

也就是说，若当前版本号为 x.y.z，则:

- 当出现严重 bug 并修复时，通过修改 z 来发布一个修订版本（如：15.6.2 至 15.6.3）。
- 当发布新功能或修复非严重 bug时，通过修改 y 来发布一个次要版本（如：15.6.2 至 15.7.0）。
- 当发布破坏性更新时，通过修改 x 来发布一个主版本（如：15.6.2 至 16.0.0）。

主版本也可能包含新功能，任何一个版本都可能包含问题修复。

次要版本是最常见的版本发布类型。

先行版本号及版本编译信息可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

## 项目结构

```
├── LICENSE
├── README.md
├── craco.config.js  craco配置文件
├── docs  文档
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── app.tsx
│   ├── components
│   │   ├── auth-fragment
│   │   │   └── index.tsx
│   │   └── layout
│   │       ├── avatar.tsx
│   │       ├── global-lan.tsx
│   │       ├── index.less
│   │       ├── index.tsx
│   │       ├── logo.tsx
│   │       └── second-layout.tsx
│   ├── context
│   │   └── AdminAuthContext.ts
│   ├── images
│   │   └── login.jpeg
│   ├── index.less
│   ├── index.tsx
│   ├── lang  多语言
│   │   ├── en-us.json
│   │   ├── i18n.tsx
│   │   └── zh-cn.json
│   ├── pages
│   │   ├── access-deny
│   │   │   └── index.tsx
│   │   ├── admin-info  用户信息
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── auth  权限管理页面
│   │   │   ├── admin  用户管理
│   │   │   │   ├── add-admin-form.tsx
│   │   │   │   ├── index.less
│   │   │   │   └── index.tsx
│   │   │   ├── page  页面管理
│   │   │   │   ├── index.tsx
│   │   │   │   └── operation.tsx
│   │   │   ├── role  角色管理
│   │   │   │   ├── index.tsx
│   │   │   │   └── role-detail-drawer.tsx
│   │   │   └── types.ts
│   │   ├── login  登录页面
│   │   │   ├── index.less
│   │   │   ├── index.tsx
│   │   │   ├── mobile.tsx
│   │   │   └── pc.tsx
│   │   └── not-found
│   │       ├── index.less
│   │       └── index.tsx
│   ├── react-app-env.d.ts
│   ├── routes  文件路由
│   │   ├── index.tsx
│   │   └── render-routes.tsx
│   ├── service  网络请求
│   │   ├── api.ts
│   │   ├── axios.ts
│   │   ├── index.ts
│   │   └── type.ts
│   ├── type.ts  公共类型
│   └── utils  工具方法
│       ├── cookie.ts
│       └── index.tsx
└── tsconfig.json
```