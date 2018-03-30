# stock-analytics
### 用于分析深市、沪市股票信息和走向趋势


## 项目启动

1. 在根目录下,输入npm install 安装依赖包
2. 安装完成后,输入 node app.js 
3. 访问本机 http://localhost:3000/


## 目录结构

- node_modules		项目依赖
- public
    - fonts			bootstrap字体文件
    - images		图片库
    - javascripts	js文件(引入jquery、 echarts, 项目代码为 index.js)
    - stylesheets	css文件(引入bootstrap, 项目css文件为 index.css)
- routes			node转发请求配置
- views				项目视图文件	
- app.js 			项目入口文件
- package.json 		npm包配置文件


## 数据来源

##### K线图
####  http://route.showapi.com/131-52
##### 分时图
####  http://img1.money.126.net/data/hs/time/today/1399001.json
##### 实时数据
####  http://ali.api.intdata.cn/stock/hs_level2/real
