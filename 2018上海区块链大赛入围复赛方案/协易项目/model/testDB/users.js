//  数据库集合名称：users
const UserSchema = new Schema({     //用户的唯一标识为用户名和objectid。
    username: {     //用户名（可做登录名）
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String    //签署协议时显示的名称
    },
    avatar: {
        type: String,       //用户头像
        default: 'http://www.baidu.jpg'
    },
    sex: {
        type: String,   //用户性别
    },
    password: {         //密码
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
    },
    state: {
        type: Number,
        default: 0 //0-禁用，1-正常。
    },
    charactor: {
        type: Number,
        default: 0 //0-普通用户，1-会员，2-管理员
    },
    friends: Array, //好友。存储用户的ObjectId
    protocols: Array, //参与的协议,数组元素为对象。{ObjectId;type:0表示协议，1表示漂流瓶}
    floater: Array,
    protocol: Array  //这是个啥......不知道
});

const User = mongoose.model('User', UserSchema);
module.exports = User;