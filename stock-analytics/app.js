/**
 * Created by lonelydawn on 2017-03-09.
 */

const Koa = require('koa');
const route = require('koa-route');
const serve = require("koa-static");
const sendfile = require("koa-sendfile");
const compress = require('koa-compress');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const path = require("path");

const common = require("./routes/common");

const app = new Koa();

// middlewares
app.use(bodyparser());
app.use(json());
app.use(logger());
app.use(compress());
app.use(serve(path.join(__dirname, "public")));

app.use(common.config);

app.use(route.get('/level2', function * () {
	var options = {
        method : "GET",
        url : "http://ali.api.intdata.cn/stock/hs_level2/real",
        json: true,
        headers : {
            code: this.request.query.code,
            Authorization: "APPCODE 2f0fd94c6db3402ba1cd561e43a994ae"
        }
    };
    var res = yield this.routeConfig(options);
    this.status = res.statusCode;
    this.body = res.body;
}));

// 初始请求返回 index.html 文件
app.use(route.get('/*',function * (){
    yield * sendfile.call(this, path.join(__dirname,'views/index.html'));
}));

app.listen(3000);
console.log("listening at port 3000!");

module.exports = app;