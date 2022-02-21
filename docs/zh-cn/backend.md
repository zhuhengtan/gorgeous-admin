# 后端架构

## 基础

使用`koa2`作为项目基础框架，`typeorm`作为orm管理，正式环境使用`pm2`进行进程维护。

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