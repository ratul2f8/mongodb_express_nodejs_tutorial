const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    admin:{
        type: Boolean,
        default: false
    }
})
User.plugin(passportLocalMongoose);
const Users = mongoose.model('User',User);
module.exports = Users;