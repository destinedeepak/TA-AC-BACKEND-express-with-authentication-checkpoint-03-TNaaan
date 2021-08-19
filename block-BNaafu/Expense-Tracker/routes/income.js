var express = require('express');
var router = express.Router();
var Income = require('../models/Income');

router.get('/new', (req, res, next) => {
    res.render('add_income');
})

router.post('/',(req, res, next) => {
    req.body.user = req.user.id;
    Income.create(req.body, (error, income) => {
      res.redirect('/dashboard');
    })
})

module.exports = router;