var PostSchema = require('../schemas/post');
var { convertTime } = require('../controllers/functions');
module.exports.getUserPosts = async function(user_id){
    var postsRes = PostSchema.find({ user:user_id }, async function(err, posts){
        if (err) throw err;
        if(posts){
            return await posts;
        }
    })
    return await postsRes;
}

module.exports.createPost = async function(senderID="", messageText="", messageReply="", callback){
    var Post = new PostSchema({
        user:senderID,
        messageText,
        messageReply,
    })
    Post.save().then((post) => {
        callback(message);
    })
}

module.exports.handlePost = function(post){

    var firstTime = new Date(post.created_at);
    var secondTime = new Date();
    var seconds = (secondTime.getTime() - firstTime.getTime()) / 1000;
    var theConvert = convertTime(seconds);
    post.created_at = theConvert;

    return post;
}
