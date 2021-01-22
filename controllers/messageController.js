var MessageSchema = require('../schemas/message');
var { convertTime } = require('../controllers/functions');
module.exports.getUserMessages = async function(user_id){
    var messagesRes = MessageSchema.find({ userTo:user_id }, async function(err, messages){
        if (err) throw err;
        if(messages){
            return await messages;
        }
    })
    return await messagesRes;
}

module.exports.handleMessage = function(message){

    var firstTime = new Date(message.created_at);
    var secondTime = new Date();
    var seconds = (secondTime.getTime() - firstTime.getTime()) / 1000;
    var theConvert = convertTime(seconds);
    message.created_at = theConvert;

    return message;
}

module.exports.createMessage = async function(senderID="", sendToID="", message="", callback){
    var Message = new MessageSchema({
        userFrom:senderID,
        userTo:sendToID,
        messageText:message
    })
    Message.save().then((message) => {
        callback(message);
    })
}

module.exports.getMessageByID = async function(userTo_id, message_id){
    return await MessageSchema.findOne({ userTo:userTo_id, id: message_id }, function(err,msg){
        if(err) throw err;
        return msg;
    });
}

module.exports.deleteMessageByID = async function(userTo_id, message_id, callback){
    return await MessageSchema.findOneAndRemove({ userTo:userTo_id, id:message_id }).then(() => {
        callback();
    });

}

