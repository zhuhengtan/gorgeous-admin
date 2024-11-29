# Quick start

Starting a demo project

## frontend

``` bash
git clone git@github.com:zhuhengtan/gorgeous-admin.git

cd gorgeous-admin

npm i && npm start
```


### deploy with docker

build：

``` bash
docker buildx build --build-arg BUILD_ENV=ready . -t [项目名]
```

run：

``` bash
docker run -d -p 80:80 [-t后面配置的参数]
```

view containers：
``` bash
docker container ls
```

stop：
``` bash
docker stop [pid]
```

## server / backend

Make sure you have set configs in /env/development.ts, and create database in your local mysql first(The database's name should be the same to your config). Env config [introductions](/en-us/backend.md#env-configs-introduction)

``` bash
git clone git@github.com:zhuhengtan/gorgeous-admin-server.git

cd gorgeous-admin-server

npm i && npm run dev

```