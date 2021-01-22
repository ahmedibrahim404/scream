var UserSchema = require('../schemas/user');
var sha1 = require('sha1');

module.exports.getUserFromID = async function(user_id){
    var userRes = UserSchema.findOne({ id:user_id }, async function(err, user){
        if (err) throw err;
        if(user){
            return await user;
        }
    })
    return await userRes;
}

module.exports.isAccount = async function(username="", email=""){
    var isAcc = false;
    await UserSchema.findOne({ $or: [ { username }, { email } ] }, async function(err,user){
        if (user) {
            isAcc = true;
        }
    })
    return await isAcc;
}

module.exports.createUser = async function(username="", email="", password="", callback){
    var User = new UserSchema({
        username:username,
        password:sha1(password),
        email:email                    
    })
    User.save().then((user) => {
        callback(user);
    })
}

module.exports.getUserWithPassword = async function(username, password){
    password=sha1(password);
    return UserSchema.findOne({username,password}, function(err,user){
        if(err) throw  err;
        return user;
    })
}

module.exports.updateUploadedImage = function(user_id){
    UserSchema.findOne({ id:user_id }, function (err, user){
        if(err) throw err;
        user.profile_img = true;
        user.save();
      });
}

let dataAvailabe = [ 'username', 'email', 'password' ];

module.exports.updateUser = async function(user_id, username, toChangeID, newValue, password){
    password=sha1(password);
    return await UserSchema.findOne({ id:user_id,username, password }, function (err, user){
        if(err) throw err;
        if(toChangeID==2) newValue=sha1(newValue);
        user[ dataAvailabe[ toChangeID ] ] = newValue;
        console.log(user);
        user.save();
        return true;
      });
}