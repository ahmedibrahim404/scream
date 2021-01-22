'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = new Schema({
    id:{type:Number},
    userFrom:{type:Number},
    userTo: {type:Number, required:true},
    messageText:{type:String, required:true},
    created_at: { type:String, default: () => new Date() }
})

var messageModel = mongoose.model('Message', messageSchema);

messageSchema.pre('save', function(next) {
    var id = 1;
    messageModel.findOne({}).sort('-id').exec(async (err, item) => {
        if(item){
            id = await item.id + 1;     
            this.id = id;
            console.log(id)                
            next();        
        } else {
            this.id = 1;
            next();
        }
    });
});


module.exports = messageModel;