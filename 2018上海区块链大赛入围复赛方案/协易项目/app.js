const koa = require("koa");
const router = require("koa-router")();
const render = require("koa-art-template");
const path = require("path");
const bodyParser = require("koa-bodyparser");
const sd = require("silly-datetime");
const jsonp = require("koa-jsonp");
const cors = require("koa2-cors");
const static = require('koa-static')
const session = require('koa-session');

const app = new koa();

app.keys = ['some secret hurr'];
const CONFIG = {
   key: 'koa:sess',   //cookie key (default is koa:sess)
   maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
   overwrite: true,  //是否可以overwrite    (默认default true)
   httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
   signed: true,   //签名默认true
   rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
   renew: false,  //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));


//配置post提交数据的中间件
app.use(bodyParser());
app.use(jsonp());
app.use(cors());
//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = function (value) {
        return sd.format(value, "YYYY-MM-DD HH:mm")
    }
});
//配置静态资源中间件
app.use(static(__dirname + "/public"));


//
// const api = require("./routes/api.js");
const routers=require('./routes/routers.js');

// router.use("/api/v1", api);
router.use("",routers);

app.use(router.routes());
app.use(router.allowedMethods);
app.listen(8001);
