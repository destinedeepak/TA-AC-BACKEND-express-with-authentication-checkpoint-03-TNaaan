var express = require('express');
var router = express.Router();
var passport = require('passport');
var Token = require('../models/Token');
var User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  const error = req.flash('error');
  // console.log(req.session, 'session');
  res.render('index', { title: 'Expense Tracker | Home', error });
});

router.get('/dashboard', function (req, res, next) {
  res.render('dashboard');
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/');
  }
);

//GET confirmation
router.get('/confirmation/:email/:token', (req, res, next) => {
  const token = req.params.token;

  Token.findOne({ token }, (error, token) => {
    // console.log(token, "tt");
    // token is not found into database i.e. token may have expired
    if (!token) {
      req.flash(
        'error',
        'Your verification link may have expired. Please click on resend to verify your Email.'
      );
      req.flash('error.resend', 'true');
      return res.redirect('/users/new');
      // if token is found then check valid user
    } else {
      User.findOne(token._userId, (error, user) => {
        // not valid user
        if (!user) {
          req.flash(
            'error',
            'We were unable to find a user for this verification. Please SignUp!'
          );
          return res.redirect('/users/new');
        }
        // user is already verified
        else if (user.isVerified) {
          req.flash('error', 'Your Email is already verified');
          return res.redirect('/');
        }
        // verify user
        else {
          user.isVerified = true;
          console.log(user.id, 'Tt');
          User.findOneAndUpdate(user._Id, user, (error, user) => {
            console.log(user, 'uuser');
            if (error) {
              return next(error);
            }
            req.flash('error', 'Your Email is verified');
            res.redirect('/dashboard');
          });
        }
      });
    }
  });
});

router.get('/logout', (req, res, next) => {
  // res.send("HI")
  req.session.destroy();
  res.clearCookie();
  res.redirect('/');
});

module.exports = router;
