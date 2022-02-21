# 快速开始

demo启动

## 前端

### 环境搭建

* node环境，在[node官网](http://nodejs.cn/download/)下载安装包一路安装即可。

### 启动项目
``` bash
git clone git@github.com:zhuhengtan/gorgeous-admin.git

cd gorgeous-admin

npm i && npm start
```

## 服务端

### 环境搭建

* node，在[node官网](http://nodejs.cn/download/)下载安装包一路安装即可。
* mysql，当前使用mysql 5.7 版本
* redis

### 启动项目

``` bash
git clone git@github.com:zhuhengtan/gorgeous-admin-server.git

cd gorgeous-admin-server

// 一定先要配置/env/development.ts并在本地mysql创建好数据库（数据库名与配置文件一致）

npm i && npm run dev

```