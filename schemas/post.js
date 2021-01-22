'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    id:{type:Number},
    user: {type:Number, required:true},
    messageText:{type:String, required:true},
    messageReply: { type:String, required:true },
    created_at: { type:String, default: () => new Date() },
})

var postModel = mongoose.model('Post', postSchema);

postSchema.pre('save', function(next) {
    var id = 1;
    postModel.findOne({}).sort('-id').exec(async (err, item) => {
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


module.exports = postModel;