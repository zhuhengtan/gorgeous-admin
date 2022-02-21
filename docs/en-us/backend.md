# Back end

## Basic

Use `koa2` as the basic framework of the project, `typeorm` as the orm management, and use `pm2` for process maintenance in the production environment。

## Structure
```
├── LICENSE
├── bin
│   └── www 
├── env
│   ├── development.ts
│   ├── index.ts
│   └── production.ts
├── nodemon.json
├── package-lock.json
├── package.json
├── readme.md 
├── src
│   ├── app.ts
│   ├── controllers 
│   │   ├── common.ts
│   │   ├── toB
│   │   │   └── auth.ts
│   │   └── toC
│   ├── entity
│   │   ├── init-data.sql
│   │   ├── toB
│   │   │   ├── admin.ts
│   │   │   ├── operation.ts
│   │   │   ├── page.ts
│   │   │   └── role.ts
│   │   └── toC
│   ├── exceptions.ts
│   ├── logger.ts
│   ├── middlewares
│   │   ├── auth.ts
│   │   ├── formatResponse.ts
│   │   ├── requestAdmin.ts
│   │   ├── requestUser.ts
│   │   └── sign.ts
│   ├── routes
│   │   ├── toBRoutes.ts
│   │   └── toCRoutes.ts
│   └── utils
│       ├── check.ts
│       ├── constants.ts
│       ├── index.ts
│       ├── redis.ts
│       ├── sendEmail.ts
│       └── upload.ts
├── tsconfig.json
└── yarn.lock
```