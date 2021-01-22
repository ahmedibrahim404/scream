'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var followingSchema = new Schema({
    userFrom:{type:Number},
    userTo: {type:Number, required:true},
    created_at: { type:String, default: () => new Date() }
});

var messageModel = mongoose.model('Follower', followingSchema);

module.exports = messageModel;