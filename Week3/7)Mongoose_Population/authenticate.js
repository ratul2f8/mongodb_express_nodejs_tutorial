var passsport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var JWT = require('jsonwebtoken');
var config = require('./config');

exports.local = passsport.use(new LocalStrategy( User.authenticate()));
passsport.serializeUser(User.serializeUser());
passsport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return JWT.sign(user, config.secretKey, { expiresIn: 3600});
};
var options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;

exports.JWTPassport = passsport.use( new JWTStrategy(options, (jwt_payload, done)  => {
    console.log('JWT payload: ',jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err){
            return done(err, false);
        }
        else if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    });
}));
exports.verifyUser = passsport.authenticate( 'jwt', {session: false});