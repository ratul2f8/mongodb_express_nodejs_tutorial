var passsport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JWTStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var JWT = require('jsonwebtoken');
var config = require('./config');
//importing for facebook based authentication
var FacebookTokenStrategy = require('passport-facebook-token');
exports.local = passsport.use(new LocalStrategy(User.authenticate()));
passsport.serializeUser(User.serializeUser());
passsport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return JWT.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};
var options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;

exports.JWTPassport = passsport.use(new JWTStrategy(options, (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    User.findOne({
        _id: jwt_payload._id
    }, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
}
exports.verifyUser = passsport.authenticate('jwt', {
    session: false
});

exports.facebookPassport = passsport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({
                facebookId: profile.id
            },
            (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (!err && user !== null) {
                    return done(err, false);
                } else {
                    var user = new User({
                        username: profile.displayName
                    });
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
    }
));