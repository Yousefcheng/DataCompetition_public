//  数据库集合名称：floater(漂流瓶)
const FloaterSchema = new Schema({
    title:String,
    content:String,
    // signatoryNum:Number,     //签署人数。
    signatory:[],            //签署人数组,存储用户名
    region:String,           //漂流的区域
    created_at: {
        type: Date,
        default: Date.now()
    },
    obtain_at:{                 //收到漂流瓶的时间。根据漂流瓶的获取的时间排序推荐。
        type: Date,
        default: Date.now()
    },
    state: {
        type: Number,
        default: 0 //漂流瓶的状态。0-漂流，1-签署。
    },
    hash:String
});
const Floater = mongoose.model('Floater', FloaterSchema);
module.exports = Floater;