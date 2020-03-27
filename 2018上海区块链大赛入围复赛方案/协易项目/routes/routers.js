const router = require("koa-router")();
const tools = require("../model/tools.js");
const DB = require("../model/db.js");
router.get("/", async (ctx) => {
  ctx.render("index.html",{
    username: ctx.session.username,
    login: ctx.session.login
  })
})
router.get("/signprotocol/:userid/:protocolid", async (ctx) => {
  ctx.render("signprotocol", {
    login: ctx.session.login
  })
})
router.get("/login", async (ctx) => {
  ctx.render("login", {
    login: ctx.session.login
  })
})
router.get("/createprotocol", async (ctx) => {
  ctx.render("createprotocol", {
    username: ctx.session.username,
    login: ctx.session.login
  })
})
router.get("/floater", async (ctx) => {
  ctx.render("floater", {
    username:ctx.session.username,
    login: ctx.session.login
  })
})
router.get("/douprotocol", async (ctx) => {
  ctx.render("douprotocol", {
    username: ctx.session.username,
    login: ctx.session.login
  })
})
router.get("/register", async (ctx) => {
  ctx.render("register",)
})
router.get("/changepwd", async (ctx) => {
  ctx.render("changepwd",)
})
router.get("/center/:username/:protocolId", async (ctx) => {
  ctx.render("center", {
    username:ctx.session.username,
    login: ctx.session.login
  })
})
router.get("/getsession", async (ctx) => {
  ctx.body = {
    username: ctx.session.username
  }
})
//注册
router.post("/doregister", async (ctx) => {
  try {
    let username = ctx.request.body.username; //用户名
    let phone = ctx.request.body.phone; //手机号
    let password = ctx.request.body.password;
    console.log(username);
    let theresultone = await DB.find("users", {
      "username": username
    });
    let theresulttwo = await DB.find("users", {
      "phone": phone
    });
    console.log(theresultone);
    if (theresultone[0]) {
      ctx.body = {
        code: 0,
        message: "用户名被占用",
        data: {}
      }
    } else if (theresulttwo[0]) {
      ctx.body = {
        code: 0,
        message: "手机号被占用",
        data: {}
      }
    } else {
      var result = await DB.insert("users", {
        "username": username,
        "phone": phone,
        "password": tools.md5(password),
      });
      if (result) {
        ctx.body = {
          code: 1,
          message: "注册成功",
          data: {
            "id": result.insertedId,
            "username": username
          }
        }
      } else {
        throw "注册失败";
      }
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: -1,
      message: e,
      data: []
    }
  }
});
//登陆
router.post("/dologin", async (ctx) => {
  try {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    // let username = ctx.query.username;
    // let password = ctx.query.password;

    var result = await DB.find("users", {
      "username": username,
      "password": tools.md5(password)
    });
    if (result[0]) {
      //session设置
      ctx.session.username = username
      ctx.session.login = "1"
      ctx.body = {
        code: 1,
        message: "登录成功",
        data: result[0]
      }
    } else {
      throw "登录失败";
    }
  } catch (e) {
    ctx.body = {
      code: 0,
      message: "登录失败",
      data: []
    }
  }
});









module.exports = router.routes();
