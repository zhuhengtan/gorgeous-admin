# 部署

- 准备一台有公网ip的服务器
- 准备一个域名（建议使用二级域名，如：admin.一级域名.com，可以省去备案的麻烦）
- 此处只写手动部署过程，如果集成CICD请参照对应平台的流程

## 后端

### 环境搭建

shell登录到服务器上，安装以下环境

#### 一、node
[安装教程](https://www.jianshu.com/p/e9db0baf781b)

```
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash
sudo yum -y install nodejs
```

#### 二、nginx

```
rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
yum install -y nginx

systemctl start nginx
```
这个时候在本机浏览器输入ip应该就能看见nginx的默认页面了

#### 三、mysql
```ssh
wget http://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
yum localinstall mysql57-community-release-el7-11.noarch.rpm
vim /etc/yum.repos.d/mysql-community.repo
```
设置你想装的版本enabled=1，我们这里使用mysql5.7版本，保存之后继续
```
yum -y install mysql-community-server
```
> 这里安装如果报错：源 "MySQL 5.7 Community Server" 的 GPG 密钥已安装，但是不适用于此软件包。请检查源的公钥 URL 是否配置正确。是需要rpm引入一下公钥：
> 
> ```rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022```
> 
> 然后再执行上面安装命令即可

启动mysql：
```
systemctl start mysqld
```
这个时候mysql其实是有默认密码的，用下面命令来查看

```
grep 'temporary password' /var/log/mysqld.log
```

拿到默认密码之后
第一次连接mysql

```
mysql -uroot -p
```

输入上面命令拿到的默认密码

修改密码：
```
alter  user 'root'@'localhost' identified by '新密码';
flush privileges;
quit;
```
下次改密码：
```
use mysql;
update mysql.user set authentication_string=password('新密码') where user='root';
flush privileges;
quit;
```

其他可能用到的：

设置mysql密码强度：
```
set global validate_password_policy=LOW;
```

#### 四、redis
```
yum -y install redis
systemctl start redis
```
你可以通过修改`/etc/redis.conf`来修改redis配置，比如端口之类的

启动如果报错，输入`journalctl -ex`查看错误详情，如果是对日志没有权限（Can't open the log file: Permission denied）
```
// 查看用户组
cat /lib/systemd/system/redis.service
// 修改权限
chown redis:redis /var/log/redis/redis.log
```
就可以启动了

#### 五、进程守护pm2
使用pm2守护进程
安装
```
npm install pm2 -g
```

pm2 常用命令：
```
// 查看状态
pm2 status

// 查看日志
pm2 log [id / app name]
```

### 启动服务端

#### 部署代码

我是直接服务器从github拉取源码在服务器上打包，所以在服务器上生成了ssh key，放到github。

linux 生成ssh key（拉取代码）
```
ssh-keygen -t rsa -C "your_email@example.com"
```

安装git
```
yum install git -y
```

**配置`/env/production.ts`**
本地开发...上传git...拉代码

#### 创建数据库并初始化数据

```
CREATE DATABASE IF NOT EXISTS gorgeous_admin_server_demo DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;
```

初始化管理员数据（/src/entity/init-data.sql），初始化之前要修改一下.sql中的管理员的email，密码默认为Ga123456，可以在前端登上之后修改密码。

然后进到mysql控制台

```
use gorgeous_admin_server_demo;

source /path/to/your/code/src/entity/init-data.sql;
```
可以看到执行结果，`show tables;`可以查看表的列表。

#### 启动项目

```
cd /path/to/your/code

npm i

npm run prd
```

如果看到：
```
[PM2] Starting /data/backends/gorgeous-admin-server-demo/bin/www in fork_mode (1 instance)
[PM2] Done.
┌─────┬───────────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name                          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼───────────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ gorgeous-admin-server-demo    │ default     │ 1.0.0   │ fork    │ 24085    │ 0s     │ 0    │ online    │ 0%       │ 13.9mb   │ root     │ disabled │
└─────┴───────────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

那么恭喜，服务端启动成功！🎉🎉🎉


## 前端

前端相对就简单多了，这里也是直接在服务端构建。

直接拉代码

进入根目录

```
npm run build
```

搞定

## nginx配置

```
nginx -V
```
可查看`nginx`的`config-path`，在配置里，会有include，在include的路径里，添加配置

下面以 `demo.gorgeous-admin.com` 域名举例

```
//  /etc/nginx/conf.d/demo-api.gorgeous-admin.com.conf

server {
  listen 80;
  server_name  demo-api.gorgeous-admin.com;

  access_log /var/www/log/demo-api.gorgeous-admin.access.log;
  error_log  /var/www/log/demo-api.gorgeous-admin.error.log;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;
    proxy_pass http://127.0.0.1:4000/; # 注意这个要跟你项目监听的端口一致
    proxy_redirect off;
  }
}
```

```
// /etc/nginx/conf.d/demo.gorgeous-admin.com.conf
server {
  server_name demo.gorgeous-admin.com;
  root /data/frontends/gorgeous-admin-demo/build;
  index index.html;

  access_log /var/www/log/demo.gorgeous-admin.access.log;
  error_log  /var/www/log/demo.gorgeous-admin.error.log;

  location /api {
    proxy_pass 'http://demo-api.gorgeous-admin.com';
  }

  location /statics/ {
    alias /data/files/upload/demo.gorgeous-admin.com/;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

⚠️ 注意，access.log和error.log，如果没有权限创建，则需要手动创建这几个文件（包括路径文件夹）

`nginx -t`没问题后，重启nginx即可。

上面的两个域名`demo-api.gorgeous.com`和`demo.gorgeous.com`需要DNS解析到这个ip。