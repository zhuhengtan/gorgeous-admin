# 后端架构

## 基础

使用`koa2`作为项目基础框架，`typeorm`作为orm管理，正式环境使用`pm2`进行进程维护。

## 配置项及说明

``` ts
 /**
 * 生产环境配置文件
 */
export const config = {
  // 系统信息，创建用户成功会用以下信息给用户发送邮件
  systemInfo: {
    name: 'gorgeous admin',
    loginUrl: '',
  },

  // 签名用到的key，也可以用UUID避免被猜到
  signKey: 'gorgeous-admin-server',
  
  // 环境名称
  env: 'production', 

  // 允许的协议
  agreement: "http",

  // 监听的端口，如有多个项目，需要使用不同的端口，切记！
  port: "3000",
  
  // 数据库设置
  database: {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "",
    password: "",
    database: "",
    synchronize: true,
    entities: [
      "dist/src/entity/*/*.js"
    ],
    cli: {
      entitiesDir: "dist/src/entity"
    },
    timezone: "+8"
  },

  // 系统管理员邮箱
  adminEmail: '',

  // 发送邮件服务设置
  email: {
    service: '',
    port: 0,
    auth: {
      // 发送方的邮箱
      user: '',
      // smtp 的授权码，是授权码，不是密码，在邮箱官网的设置里面获取 
      pass: ''
    },
    // 发送方的展示名称
    from: '',
  },

  // redis设置
  redis: {
    // redis端口
    port: 0,
    // Redis 服务器
    host: '',
    db: 0,
    // 存诸的前缀
    prefix: 'gorgeous-admin-server-code:',
    // 过期时间
    ttl: 60 * 5,
  },

  // 文件上传
  // 静态资源放在服务器上的位置
  staticPath: '',
  // 拼接的静态资源url前缀
  staticPrefix: '',
};
```

## 项目结构
```
├── LICENSE
├── bin
│   └── www 
├── env // 环境配置
│   ├── development.ts
│   ├── index.ts
│   └── production.ts
├── nodemon.json
├── package-lock.json
├── package.json
├── readme.md 
├── src
│   ├── app.ts  整个app创建的地方
│   ├── controllers  controllers
│   │   ├── common.ts  通用controller
│   │   ├── toB  B端controller
│   │   │   └── auth.ts  权限接口
│   │   └── toC  C端controller
│   ├── entity  实体（类）
│   │   ├── init-data.sql  初始化数据
│   │   ├── toB  B端实体
│   │   │   ├── admin.ts
│   │   │   ├── operation.ts
│   │   │   ├── page.ts
│   │   │   └── role.ts
│   │   └── toC  C端实体
│   ├── exceptions.ts
│   ├── logger.ts
│   ├── middlewares  中间件
│   │   ├── auth.ts  权限判断中间件
│   │   ├── formatResponse.ts  格式化返回值中间件
│   │   ├── requestAdmin.ts  将管理端请求人放入上下文context中
│   │   ├── requestUser.ts  将C端请求人放入上下文context中
│   │   └── sign.ts  接口签名中间件
│   ├── routes  路由（api）
│   │   ├── toBRoutes.ts
│   │   └── toCRoutes.ts
│   └── utils  工具方法
│       ├── check.ts  校验（一般是正则校验）
│       ├── constants.ts  静态变量（很少用，一般在环境配置文件中配置）
│       ├── index.ts
│       ├── redis.ts  redis工具
│       ├── sendEmail.ts  发送邮件工具
│       └── upload.ts  上传文件工具
├── tsconfig.json
└── yarn.lock
```