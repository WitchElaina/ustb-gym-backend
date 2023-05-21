# Backend

安装 node

```bash
npm install
```

设置 MongoDB 数据库 URI, 创建`.env`文件, 写入

```
MONGODB_URI=<your mongodb uri>
```

运行服务器

```bash
node server.js
```

# API

## 登录

### 请求

- URL: `/login`
- 方法: POST

#### 请求体参数

| 参数名   | 类型   | 描述   |
| -------- | ------ | ------ |
| username | 字符串 | 用户名 |
| password | 字符串 | 密码   |

### 响应

#### 成功响应

- 状态码: 200 OK
- 响应体: "Login success!"

#### 失败响应

- 状态码: 401 Unauthorized
- 响应体: "Login failed!"

---

## 注册

### 请求

- URL: `/register`
- 方法: POST

#### 请求体参数

| 参数名   | 类型   | 描述   |
| -------- | ------ | ------ |
| username | 字符串 | 用户名 |
| password | 字符串 | 密码   |
| role     | 字符串 | 角色   |

### 响应

#### 成功响应

- 状态码: 200 OK
- 响应体: "Register success!"

#### 失败响应

- 状态码: 401 Unauthorized
- 响应体: "Register failed!"

---

## 预定

### 请求

- URL: `/reservation`
- 方法: POST

#### 请求体参数

| 参数名   | 类型   | 描述   |
| -------- | ------ | ------ |
| username | 字符串 | 用户名 |
| date     | 字符串 | 日期   |
| time     | 字符串 | 时间   |
| room     | 字符串 | 房间   |

### 响应

#### 成功响应

- 状态码: 200 OK
- 响应体:

```
{
"status": "success"
}
```

#### 失败响应

- 状态码: 200 OK
- 响应体:

```
{
"status": "failed"
}
```

---

## 获取用户信息

### 请求

- URL: `/user`
- 方法: POST

#### 请求体参数

| 参数名   | 类型   | 描述   |
| -------- | ------ | ------ |
| username | 字符串 | 用户名 |

### 响应

#### 成功响应

- 状态码: 200 OK
- 响应体:

```
{
"status": "success",
"userInfo": { /* 用户信息对象 / },
"userReservation": [ / 用户预定列表 */ ]
}
```

#### 失败响应

- 状态码: 401 Unauthorized
- 响应体:

```
{
"status": "failed"
}
```

---

## 获取用户预定信息

### 请求

- URL: `/userorder`
- 方法: POST

#### 请求体参数

| 参数名   | 类型   | 描述   |
| -------- | ------ | ------ |
| username | 字符串 | 用户名 |

### 响应

#### 成功响应

- 状态码: 200 OK
- 响应体:

```
{
"status": "success",
"userReservation": [ /* 用户预定列表 */ ]
}
```

#### 失败响应

- 状态码: 401 Unauthorized
- 响应体:

```
{
"status": "failed"
}
```

---

## 取消预定

### 请求

- URL: `/cancel`
- 方法: POST

#### 请求体参数

| 参数名   | 类型   | 描述   |
| -------- | ------ | ------ |
| username | 字符串 | 用户名 |
| date     | 字符串 | 日期   |
| time     | 字符串 | 时间   |
| room     | 字符串 | 房间   |

### 响应

#### 成功响应

- 状态码: 200 OK
- 响应体:

```
{
"status": "success"
}
```

#### 失败响应

- 状态码: 401 Unauthorized
- 响应体:

```
{
"status": "failed"
}
```
