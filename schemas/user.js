'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
    id:{ type:Number },
    username:{ type:String,lowercase: true, minlength:3, maxlength:25 },
    password:{ type:String },
    email:{ type:String, minlength:8 },
    profile_img: { type:Boolean },    
    whosendme:{ type:Boolean, default:false },
    wholikeme:{ type:Boolean, default:false },
    created_at: { type:String, default: () => new Date() }
})

var UserModel = mongoose.model('User',UserSchema);

// Auto Increment to User Id 
UserSchema.pre('save', function(next) {
    var id = 1;
    UserModel.findOne({}).sort('-id').exec(async (err, item) => {
        if(item){
            id = await item.id + 1;     
            this.id = id;
            next();        
        } else {
            this.id = 1;
            next();
        }
    });
});

module.exports = UserModel