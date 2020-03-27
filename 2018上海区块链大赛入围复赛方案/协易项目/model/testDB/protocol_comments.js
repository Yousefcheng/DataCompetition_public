//  数据库集合名称：protocol_comments
const Protocol_commentsSchema = new Schema({
    protocol_id:String,
    user_id:String,
    content:String,
    created_at: {
        type: Date,
        default: Date.now()
    }
});
const Protocol_comments = mongoose.model('Protocol_comments', Protocol_commentsSchema);
module.exports = Protocol_comments;