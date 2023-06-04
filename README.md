# Backend

## 部署

首先配置数据库，设置 MongoDB 数据库 URI。在项目根目录创建`.env`文件, 写入

```
MONGODB_URI=<your mongodb uri>
```

### 本地部署

安装 node

```bash
npm install
```

### 使用 Docker

从 Docker Hub 拉取镜像

```bash
docker pull witchelaina/ustb-gym-backend
```

运行容器

```bash
docker run -d -p 3456:3456 --name ustb-backend -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=123456 witchelaina/ustb-gym-backend
```

访问容器终端

```bash
docker exec -it ustb-backend /bin/bash
```

## 运行

```bash
npm run dev
```

### [Optional] 自定义端口

在`.env`文件中写入

```
PORT=<your port>
```
