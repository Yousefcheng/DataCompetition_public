//  数据库集合名称：Protocol
const ProtocolSchema = new Schema({
    title:String,
    content:String, 
    signatoryNum:Number,     //签署人数。
    signatory:[],            //签署人数组 存储用户的ObjectId     
    share:{                  // 分享：0->未分享，1->已分享
        type:Number,
        default:0,
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    state: {
        type: Number,
        default: 0 //协议的状态。0，1-正常（生效）。
    },
    praise:[],  //点赞
    praiseNum:Number,   //点赞数
    // comments:[{     //评论
    //     user_id:Number,     //评论者id
    //     user_name:String,   //评论者用户名
    //     avatar:String,
    //     content:String,     //评论内容
    //     created_at:String,   //评论时间
    //     state:Number,       //0->禁用，1->正常
    // }],
    hash:String,
    comments:[]     //存储评论的id
});
const Protocol = mongoose.model('Protocol', ProtocolSchema);
module.exports = Protocol;