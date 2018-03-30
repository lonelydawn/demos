# ChatRoom

## Content

* 使用 webpack, jquery, websocket 搭建的简单 web 聊天室。
* 在聊天室中，你可以广播消息或者私聊某人。
* 当你打开网页时，你会获得一个随机昵称。你可以修改他，我们会把修改同步到所有客户端。

## 开始

##### 安装依赖

可以使用以下命令安装依赖：

```shell
npm install
```

##### 开发

运行

```shell
npm start
```

启动 webpack 服务，以调试项目。

##### 生产

如果要发布生产版本，运行

```shell
npm run build
```

以编译和压缩源代码。

之后运行

```shell
node app.js
```

启动一个 [koa](https://github.com/koajs/koa) 搭建的服务端。

### ws

最后，别忘了启动 websocket。

```shell
node ws.js
```



