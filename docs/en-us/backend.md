# Back end

## Basic

Use `koa2` as the basic framework of the project, `typeorm` as the orm management, and use `pm2` for process maintenance in the production environment。

## Env configs introduction

``` ts
 /**
 * production
 */
export const config = {
  // email info
  systemInfo: {
    name: 'gorgeous admin',
    loginUrl: '',
  },

  // sign key，you can use UUID as well
  signKey: 'gorgeous-admin-server',
  
  // name of env
  env: 'production', 

  // protocal agreed
  agreement: "http",

  // port listening
  port: "3000",
  
  // database config
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

  adminEmail: '',

  // email config
  email: {
    service: '',
    port: 0,
    auth: {
      // sender email
      user: '',
      // smtp auth code 
      pass: ''
    },
    // sender display name
    from: '',
  },

  // redis config
  redis: {
    // redis port
    port: 0,
    // Redis host
    host: '',
    db: 0,
    // prefix in db
    prefix: 'gorgeous-admin-server-code:',
    // timeout
    ttl: 60 * 5,
  },

  // upload
  // static files save path on server
  staticPath: '',
  // url prefix(domain)
  staticPrefix: '',
};
```


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