//const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
//imports for using json web token based authentication
//applying CORS config
const cors = require('./cors');
var authenticate = require('../authenticate');
/* GET users listing. */
router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,function(req,res,next){
    User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users)
    })
    .catch(err => next(err))
}, err => next(err));
router.post('/signup',cors.corsWithOptions, function(req, res, next){
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err: err});
    }
    else{
      if(req.body.firstname){
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname;
      }
      //IMPORTANT: "admin" property shouldn't be included
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json({err: err});
          return;
        }
        passport.authenticate('local')(req, res, () =>{
          res.statusCode  = 200;
          res.setHeader('Content-Type','application/json');
          res.json({ status: 'Registration Successful', success: true});
        });
      });
    }
  });
});
router.post('/login', cors.corsWithOptions,passport.authenticate('local'), (req,res) => {
  //if a user has been found then generate a json web token for the user
  var token = authenticate.getToken({_id: req.user._id});
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
router.get('/facebook/token', passport.authenticate('facebook-token'),(req,res)=> {
  if(req.user){
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token ,status: 'You are successfully loggedin!'});
  }
});
module.exports = router;
