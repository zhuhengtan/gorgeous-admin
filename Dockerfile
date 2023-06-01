# 使用 node 镜像，任何操作，都需要在镜像下进行
FROM node:16 AS build

# 构建参数
ARG BUILD_ENV

# 设置容器内的目录，通常我们会使用 app 目录
WORKDIR /app

# 项目文件拷贝到容器 /app 下
COPY . .

# 下载依赖包，并构建打包文件
RUN npm i & npm run build:$BUILD_ENV

# 使用 nginx 镜像
FROM nginx:1.21

# 不同的镜像上下文需要独立接受参数
ARG BUILD_ENV

# 跳转到 nginx 的 80 静态服务对应的目录
WORKDIR /usr/share/nginx/html

# 删掉里面的文件
RUN rm -rf ./*

# 直接将我们在 node 镜像的打包文件拷贝到这里
COPY --from=build /app/build .

# 修改nginx
COPY /nginx/proxy /etc/nginx/conf.d/proxy
COPY /nginx/${BUILD_ENV}.conf /etc/nginx/conf.d/default.conf

# 暴露 80和8080 端口
EXPOSE 80
EXPOSE 8080

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]