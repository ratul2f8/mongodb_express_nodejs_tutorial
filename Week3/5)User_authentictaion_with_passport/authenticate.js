var passsport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

exports.local = passsport.use(new LocalStrategy( User.authenticate()));
passsport.serializeUser(User.serializeUser());
passsport.deserializeUser(User.deserializeUser());
