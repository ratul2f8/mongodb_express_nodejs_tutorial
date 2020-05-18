const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

var Users = mongoose.model('User', userSchema);
module.exports = Users;
