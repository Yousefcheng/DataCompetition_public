const router = require("koa-router")();
const tools = require("../model/tools.js");
const DB = require("../model/db.js");

router.get("/", async (ctx) => {
    ctx.body = "这是接口";
});

//注册
router.post("/doregister", async (ctx) => {
    try {
        let username = ctx.request.body.username;   //用户名
        let phone = ctx.request.body.phone; //手机号
        let password = ctx.request.body.password;
        let theresultone = await DB.find("users", {"username": username});
        let theresulttwo = await DB.find("users", {"phone": phone});
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
                "protocols": [],
                "protocol": [],
                "floater": [],
                "nickname": null,
                "sex": null,
                "email": null,
            });
            console.log(result);
            inserUsername= result.ops[0].username;
            if (result) {
                ctx.body = {
                    code: 1,
                    message: "注册成功",
                    data: {"id": result.insertedId,"username":inserUsername}
                }
            } else {
                throw "注册失败";
            }
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: e,
            data: []
        }
    }
});
//登录
router.post("/dologin", async (ctx) => {
    try {
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;

        // let username = ctx.query.username;
        // let password = ctx.query.password;

        var result = await DB.find("users", {"username": username, "password": tools.md5(password)});
        if (result[0]) {
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
//根据用户id 获取用户信息
router.get("/userinfo", async (ctx) => {
    try {
        let id = ctx.query.id;
        var userresult = await DB.find("users", {"_id": DB.getObjectId(id)});
        ctx.body = {
            code: 1,
            message: "获取用户信息成功",
            data: userresult[0],
        }
    } catch (e) {
        ctx.body = {
            code: 0,
            message: "获取用户信息失败",
            data: id,
        }
    }
});


// 生成协议
router.post("/doProtocol", async (ctx) => {
    try {
        let title = ctx.request.body.title;         //协议标题
        let content = ctx.request.body.content;       //协议内容
        let signatoryNum = ctx.request.body.signatoryNum; //签署人数
        let username = ctx.request.body.username;     //发起者的用户名
        let share = ctx.request.body.share;     //是否分享

        console.log(share);

        // let title = ctx.query.title;         //协议标题
        // let content = ctx.query.content;       //协议内容
        // let signatoryNum = ctx.query.signatoryNum; //签署人数
        // let username = ctx.query.username;     //发起者的用户名

        let addResult = await DB.insert("protocol", {
            "title": title,
            "content": content,
            "signatoryNum": Number(signatoryNum),
            "signatory": [username],
            "created_at": new Date(),
            "state": Number(0),
            "share": Number(share),
            "comments": [],
            "protocol_praise": []
        });
        // console.log(addResult);
        let protocolId = addResult.insertedId;  //insertedId 该协议的id
        let protocolItem = {
            id: protocolId,
            type: Number(0)
        };
        // console.log(protocolItem);
        let userResult = await DB.find("users", {"username": username});
        console.log(userResult);
        userResult[0].protocols.push(protocolItem);     //存入协议+漂流瓶
        userResult[0].protocol.push(protocolId);        //存入协议
        console.log(userResult[0].protocols);
        // console.log(2);
        let upResult = await DB.update("users", {"username": username}, {
            "protocols": userResult[0].protocols,
            "protocol": userResult[0].protocol
        });
        // console.log(1);
        if (protocolId) {     //文档的objectID
            ctx.body = {
                code: 1,
                message: "创建成功",
                data: {"id": protocolId}
            }
        } else {
            throw "创建失败"
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "创建失败",
            data: {}
        }
    }
});
//获取协议（分享协议,分享给好友签署，不是公开)
router.get("/getProtocol", async (ctx) => {
    try {
        let id = ctx.query.id;
        var result = await DB.find("protocol", {"_id": DB.getObjectId(id)});

        console.log(result);
        // console.log(result[0].signatoryNum);
        // console.log(result[0].signatory.length);
        console.log(result[0].signatoryNum < result[0].signatory.length);
        if (result[0].signatoryNum > result[0].signatory.length) {
            // var updateResult = await DB.update("protocol", {"_id": DB.getObjectId(id)}, {"share": Number(1)});
            // console.log(updateResult);

            ctx.body = {
                code: 1,
                message: "协议内容获取成功",
                data: result[0]
            };
        } else {
            let result = await DB.find("protocol", {"_id": DB.getObjectId(id)});
            ctx.body = {
                code: 0,
                message: "签署人数已满",
                data: result[0]
            };
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "协议内容获取失败",
            data: []
        }
    }
});
//签署协议
router.post("/signProtocol", async (ctx) => {
    try {
        let username = ctx.request.body.username;         //签署人的用户名
        let id = ctx.request.body.id;                      //协议的objectid

        // var username = ctx.query.username;         //签署人的用户名
        // var id = ctx.query.id;                      //协议的objectid

        var protocolResult = await DB.find("protocol", {"_id": DB.getObjectId(id)});
        if (protocolResult[0].signatory.indexOf(username) > -1) {
            ctx.body = {
                code: 0,
                message: "您已参与本协议",
                data: {}
            }
        } else {
            if (Number(protocolResult[0].state) == 1) {
                ctx.body = {
                    code: -1,
                    message: "该协议已生效，无法再添加签约人数。",
                    data: {}
                }
            } else {
                protocolResult[0].signatory.push(username);
                let upResult = await DB.update("protocol", {"_id": DB.getObjectId(id)}, {
                    "signatory": protocolResult[0].signatory
                });
                let result = await DB.find("protocol", {"_id": DB.getObjectId(id)});
                if (result[0].signatory.length == result[0].signatoryNum) {
                    await DB.update("protocol", {"_id": DB.getObjectId(id)}, {"state": Number(1)});
                }
                let userResult = await DB.find("users", {"username": username});
                console.log(userResult);

                let protocolItem = {        //要存入协议+漂流瓶的协议对象
                    id: id,
                    type: Number(0)
                };
                userResult[0].protocols.push(protocolItem);
                userResult[0].protocol.push(id);
                //签署协议后更新签署人的用户表
                let updateResult = await DB.update("users", {"username": username}, {
                    "protocols": userResult[0].protocols,
                    "protocol": userResult[0].protocol
                });

                ctx.body = {
                    code: 1,
                    message: "创建成功",
                    data: protocolResult
                }
            }
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "创建失败",
            data: protocolResult
        }
    }
});
//改变协议状态
router.post("/changeProtocolState", async (ctx) => {
    try {
        let id = ctx.request.body.id;   //获取协议的id
        var result = await DB.find("protocol", {"_id": DB.getObjectId(id)});
        xchange = result[0].share
        if (xchange) {
            xchange = 0
        } else {
            xchange = 1
        }
        let upResult = await DB.update("protocol", {"_id": DB.getObjectId(id)}, {
            "share": Number(xchange)
        });
        ctx.body = {
            code: 1,
            message: "修改状态成功",
            data: result[0]._id
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "修改状态失败",
            data: null
        }
    }
});
//获取协议列表
router.get("/protocolList/:pageSize/:page", async (ctx) => {
    try {
        thepageSize = ctx.params.pageSize;
        thepage = ctx.params.page;
        console.log(thepage);
        var getprotocolresult = await DB.find("protocol", {"share": Number(1), "state": Number(1)}, {}, {
            "page": Number(thepage),
            "pageSize": Number(thepageSize)
            // sortJson: {"praiseNum": 1}
        });
        ctx.body = {
            code: 1,
            message: "获取已分享协议列表",
            data: getprotocolresult,
        }
    } catch (e) {
        ctx.body = {
            code: 0,
            message: "获取列表失败",
            data: []
        }
    }
});


//获取评论列表
router.get("/protocol-commentsList", async (ctx) => {      //---->127.0.0.1/api/v1/code/code-comments?id=5b0d593ffc0f8c0accd1ae7a
    try {
        let id = ctx.query.id;  //协议的id
        let protocolCommentsArray = await DB.find("protocol_comments", {"protocol_id": id});  //查找所有的评论
        console.log(protocolCommentsArray);

        ctx.body = {
            code: 1,
            message: "开源项目的评论查询成功",
            data: protocolCommentsArray
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "开源项目的评论查询失败",
            data: []
        }
    }
});
//发表评论
router.post("/protocol-comments", async (ctx) => {
    try {
        let protocol_id = ctx.request.body.protocol_id;
        let user_id = ctx.request.body.user_id;
        let content = ctx.request.body.content;

        // let protocol_id = ctx.query.protocol_id;
        // let user_id = ctx.query.user_id;
        // let content = ctx.query.content;

        let addResult = await DB.insert("protocol_comments", {
            "protocol_id": protocol_id,
            "user_id": user_id,
            "content": content,
            "created_at": new Date(),
        });
        console.log(addResult);
        let findResult = await DB.find("protocol", {"_id": DB.getObjectId(protocol_id)});
        findResult[0].comments.push(addResult.insertedId);
        console.log(findResult[0].comments);
        await DB.update("protocol", {"_id": DB.getObjectId(protocol_id)}, {
            "comments": findResult[0].comments,
        });
        ctx.body = {
            code: 1,
            message: "评论添加成功",
            data: addResult
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "评论添加失败",
            data: {}
        }
    }
});
//点赞
router.post("/protocol-parise", async (ctx) => {
    try {
        let protocol_id = ctx.request.body.protocol_id;
        let user_id = ctx.request.body.user_id;

        // let protocol_id = ctx.query.protocol_id;
        // let user_id = ctx.query.user_id;

        let findResult = await DB.find("protocol", {"_id": DB.getObjectId(protocol_id)});
        if (findResult[0].protocol_praise.indexOf(user_id) > -1) {
            console.log("2" + findResult[0].protocol_praise.indexOf(user_id));
            ctx.body = {
                code: 0,
                message: "您已点赞过",
                data: {"ok": 1}
            }
        } else {
            findResult[0].protocol_praise.push(user_id);
            let num = findResult[0].protocol_praise.length;
            let updateResult = await DB.update("protocol", {"_id": DB.getObjectId(protocol_id)}, {
                "protocol_praise": findResult[0].protocol_praise,
                "praiseNum": num,
            });
            ctx.body = {
                code: 1,
                message: "点赞成功",
                data: updateResult
            }
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "点赞失败",
            data: {}
        }
    }
});

//生成漂流瓶
router.post("/makefloater", async (ctx) => {
    try {
        let title = ctx.request.body.title;         //漂流瓶标题
        let content = ctx.request.body.content;       //漂流瓶内容
        let region = ctx.request.body.region;          //漂流地方
        let username = ctx.request.body.username;     //发起者的用户名

        // let title = ctx.query.title;         //协议标题
        // let content = ctx.query.content;       //协议内容
        // let region = ctx.query.region;          //漂流地方
        // let username = ctx.query.username;     //发起者的用户名
        let addResult = await DB.insert("floater", {
            "title": title,
            "content": content,
            "signatory": [username],
            "created_at": new Date(),
            "obtain_at": new Date(),
            "region": region,
            "state": Number(0),
        });

        let floaterId = addResult.insertedId;
        let floaterItem = {
            id: floaterId,
            type: Number(1)
        };
        let userResult = await DB.find("users", {"username": username});
        console.log(userResult);
        userResult[0].protocols.push(floaterItem);  //在所有签过的协议、漂流瓶数组添加这条记录
        userResult[0].floater.push(floaterId);      //在漂流瓶数组中添加这条记录。
        let upResult = await DB.update("users", {"username": username}, {
            "protocols": userResult[0].protocols,
            "floater": userResult[0].floater
        });


        if (floaterId) {     //文档的objectID
            ctx.body = {
                code: 1,
                message: "漂流瓶创建成功",
                data: {"id": floaterId}
            }
        } else {
            throw "创建失败"
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "创建失败",
            data: {}
        }
    }
});
//漂流瓶页面数据
router.get("/myfloater", async (ctx) => {
    try {
        let id = ctx.query.id;
        // let username = ctx.query.username;
        // console.log(id);
        //存放随机生成的一个漂流瓶和自己已签署过的漂流瓶
        var result = [];

        //获取用户已签署的漂流瓶，不包含自己发布但无人签署的部分


        let myfloaterResult = await DB.find("users", {"_id": DB.getObjectId(id)});
        console.log(myfloaterResult);
        let floaterNum = myfloaterResult[0].floater.length;
        var myfloaterArray = [];
        for (let i = 0; i < floaterNum; i++) {
            let myfloaterId = myfloaterResult[0].floater[i];
            let myfloater = await DB.find("floater", {"_id": DB.getObjectId(myfloaterId), "state": 1});
            myfloaterArray.push(myfloater[0]);
        }

        //生成随机数函数，用来获取随机的一个漂流瓶
        function getFloaterRandom(start, end) {
            var length = end - start + 1;
            var num = parseInt(Math.random() * (length) + start);
            return num;
        }

        //获取未签署漂流瓶的个数
        var getfloaterresult = await DB.find("floater", {"state": 0});
        let floaterRandomNum = getfloaterresult.length;
        let theNum = getFloaterRandom(0, floaterRandomNum);
        var floaterRandom = [];
        floaterRandom.push(getfloaterresult[theNum]);

        result = floaterRandom.concat(myfloaterArray);

        ctx.body = {
            code: 1,
            message: "获取信息成功",
            data: result
        }
    } catch (e) {
        ctx.body = {
            code: 0,
            message: "获取信息失败",
            data: result
        }
    }
});
//签署漂流瓶
router.post("/signFloater", async (ctx) => {
    try {
        let username = ctx.request.body.username;         //签署人的用户名
        let id = ctx.request.body.id;                      //漂流瓶的objectid

        // let username = ctx.query.username;         //签署人的用户名
        // let id = ctx.query.id;                      //协议的objectid
        let floaterResult = await DB.find("floater", {"_id": DB.getObjectId(id)});
        if (floaterResult[0].signatory.indexOf(username) > -1) {
            ctx.body = {
                code: 0,
                message: "您是漂流瓶发起者，就不要再签了哦",
                data: {}
            }
        } else {
            if (Number(floaterResult[0].state == 1)) {
                ctx.body = {
                    code: -1,
                    message: "该漂流瓶已生效，无法再添加签约人数。",
                    data: {}
                }
            } else {
                floaterResult[0].signatory.push(username);
                let updateResult = await DB.update("floater", {"_id": DB.getObjectId(id)}, {
                    "state": Number(1),
                    "obtain_at": new Date(),
                    "signatory": floaterResult[0].signatory
                });
                let userResult = await DB.find("users", {"username": username});

                let floaterId = {
                    id: id,
                    type: Number(1)
                };
                userResult[0].floater.push(id);
                userResult[0].protocols.push(floaterId);
                let upResult = await DB.update("users", {"username": username}, {
                    "protocols": userResult[0].protocols,
                    "floater": userResult[0].floater
                });

                let result = await DB.find("floater", {"_id": DB.getObjectId(id)});
                ctx.body = {
                    code: 1,
                    message: "漂流瓶签署成功",
                    data: result
                }
            }
        }

    } catch (e) {
        ctx.body = {
            code: -1,
            message: "漂流瓶签署失败",
            data: []
        }
    }
});
//获取漂流瓶
router.get("/getFloater", async (ctx) => {
    try {
        let id = ctx.query.id;
        var result = await DB.find("floater", {"_id": DB.getObjectId(id)});
        // console.log(result[0].signatoryNum);
        // console.log(result[0].signatory.length);
        // console.log(result[0].signatoryNum <= result[0].signatory.length);
        if (2 >= result[0].signatory.length) {
            // var updateResult = await DB.update("protocol", {"_id": DB.getObjectId(id)}, {"share": Number(1)});
            // console.log(updateResult);

            ctx.body = {
                code: 1,
                message: "漂流瓶内容获取成功",
                data: result[0]
            };
        } else {
            let result = await DB.find("floater", {"_id": DB.getObjectId(id)});
            ctx.body = {
                code: 0,
                message: "签署人数已满",
                data: result[0]
            };
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "协议内容获取失败",
            data: []
        }
    }
});
//随机获取漂流瓶
router.get("/getRandomFloater", async (ctx) => {
    try {
        let id = ctx.query.id;  //获取用户id
        //生成随机数函数，用来获取随机的一个漂流瓶
        function getFloaterRandom(start, end) {
            var length = end - start + 1;
            var num = parseInt(Math.random() * (length) + start);
            return num;
        }

        //获取未签署漂流瓶的个数
        var getfloaterresult = await DB.find("floater", {"state": 0});
        let floaterRandomNum = getfloaterresult.length;
        let theNum = getFloaterRandom(0, floaterRandomNum);
        var floaterRandom = [];
        floaterRandom.push(getfloaterresult[theNum]);

        ctx.body = {
            code: 1,
            message: "获取信息成功",
            data: floaterRandom[0]
        }
    } catch (e) {
        ctx.body = {
            code: 0,
            message: "获取信息失败",
            data: result
        }
    }
});

//修改个人信息
router.post("/modifyinfo", async (ctx) => {
    try {
        let id = ctx.request.body.id;
        let nickname = ctx.request.body.nickname;
        let avatar = ctx.request.body.avatar;
        let sex = ctx.request.body.sex;
        let career = ctx.request.body.career;
        let region = ctx.request.body.region;
        let phone = ctx.request.body.phone;
        let email = ctx.request.body.email;
        let password = ctx.request.body.password;

        // let id=ctx.query.id;
        // let nickname = ctx.query.nickname;
        // let avatar = ctx.query.avatar;
        // let sex=ctx.query.sex;
        // let career=ctx.query.career;
        // let region=ctx.query.region;
        // let phone=ctx.query.phone;
        // let email =ctx.query.email;

        let updateResult = await DB.update("users", {"_id": DB.getObjectId(id)}, {
            "nickname": nickname,
            "avatar": avatar,
            "sex": sex,
            "career": career,
            "region": region,
            "phone": phone,
            "email": email,
            "password": tools.md5(password),
        });
        ctx.body = {
            code: 1,
            message: "修改学生信息成功",
            data: updateResult
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "修改学生信息失败",
            data: []
        }
    }
});
//获取我参与的协议
router.get("/myprotocol", async (ctx) => {
    try {
        let id = ctx.query.id;
        console.log(id);
        var myresult = await DB.find("users", {"_id": DB.getObjectId(id)});
        var myprotocolresult = myresult[0].protocols;
        console.log(myprotocolresult);
        var getmyprotocolresult = [];
        for (i = 0; i < myprotocolresult.length; i++) {
            if (myprotocolresult[i].type == 0) {
                getmyprotocolresult.push(await DB.find("protocol", {"_id": DB.getObjectId(myprotocolresult[i].id)}));
            } else if (myprotocolresult[i].type == 1) {
                getmyprotocolresult.push(await DB.find("floater", {"_id": DB.getObjectId(myprotocolresult[i].id)}));
            }
        }
        ctx.body = {
            code: 1,
            message: "获取协议列表成功",
            data: getmyprotocolresult,
        }
    } catch (e) {
        ctx.body = {
            code: 0,
            message: "获取协议列表失败",
            data: []
        }
    }
});
//查看具体协议
router.get("/viewProtocol", async (ctx) => {
    try {
        let id = ctx.query.id;
        console.log(id);
        let result = await DB.find("protocol", {"_id": DB.getObjectId(id)});
        let protocol_comments = await DB.find("protocol_comments", {"protocol_id": id});
        result[0].protocol_comments = protocol_comments;
        ctx.body = {
            code: 1,
            message: "查看具体协议成功",
            data: result[0],
        };
    } catch (e) {
        ctx.body = {
            code: -1,
            message: "捞取漂流瓶失败",
            data: []
        }
    }
});
//意见反馈
router.post("/feedback", async (ctx) => {
    try {
        let content = ctx.request.body.content;       //漂流瓶内容
        let phone = ctx.request.body.phone || "";             //手机号
        let qq = ctx.request.body.qq || "";
        let weixin = ctx.request.body.weixin || "";
        let addResult = await DB.insert("floater", {
            "content": content,
            "phone": phone,
            "qq": qq,
            "weixin": weixin,
            "created_at": new Date(),
        });
        let protocolId = addResult.insertedId;

        ctx.body = {
            code: 1,
            message: "意见反馈成功",
            data: protocolId,
        };

    } catch (e) {
        ctx.body = {
            code: -1,
            message: "意见反馈失败，请稍后重试",
            data: [],
        };
    }
});


module.exports = router.routes();

