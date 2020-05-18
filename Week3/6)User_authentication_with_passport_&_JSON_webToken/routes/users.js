//const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//imports for using json web token based authentication
var authenticate = require('../authenticate');
router.post('/signup', function(req, res, next){
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err: err});
    }
    else{
      passport.authenticate('local')(req, res, () =>{
        res.statusCode  = 200;
        res.setHeader('Content-Type','application/json');
        res.json({ status: 'Registration Successful', success: true});
      });
    }
  });
});
router.post('/login', passport.authenticate('local'), (req,res) => {
  //if a user has been found then generate a json web token for the user
  var token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token ,status: 'You are successfully loggedin!'});
});
router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;
