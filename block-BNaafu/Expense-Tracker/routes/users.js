var express = require('express');
var router = express.Router();

var User = require('../models/User');
//GET new regitration form 
router.get('/new', (req, res, next) => {
  const error = req.flash('error');
  res.render('register', {error})
})

//  registration
router.post('/', (req, res, next) => {
  var {email, password} = req.body;
  User.create(req.body, (error, user) => {
    if (error) {
      if (error.name === 'MongoError') {
        req.flash('error', 'Admin already exsits!');
        return res.redirect('/users/new');
      }
      if (error.name === 'ValidationError') {
        req.flash('error', error.message);
        return res.redirect('/users/new');
      }
    }
    res.redirect('/')
  });
});

//GET new login form 
router.get('/login', (req, res, next) => {
  const error = req.flash('error');
  res.render('login', {error})
})

// login
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Enter required fields!');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (error, user) => {
    if (error) return next(error);
    if (!user) {
      req.flash('error', 'User does not exists!');
      return res.redirect('/users/login');
    }
    user.comparePassword(password, (error, result) => {
      if (error) return next(error);
      if (!result) {
        req.flash('error', 'Password is wrong!');
        return res.redirect('/users/login');
      }else{
        req.session.userId = user.id;
        res.redirect('/')
      }
    });
  });
});

module.exports = router;
