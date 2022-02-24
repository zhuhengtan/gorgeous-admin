# Quick start

Starting a demo project

## frontend

``` bash
git clone git@github.com:zhuhengtan/gorgeous-admin.git

cd gorgeous-admin

npm i && npm start
```

## server / backend

Make sure you have set configs in /env/development.ts, and create database in your local mysql first(The database's name should be the same to your config). Env config [introductions](/en-us/backend.md#env-configs-introduction)

``` bash
git clone git@github.com:zhuhengtan/gorgeous-admin-server.git

cd gorgeous-admin-server

npm i && npm run dev

```