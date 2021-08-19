var express = require('express');
var router = express.Router();
var Expense = require('../models/Expense')

router.get('/new', (req, res, next) => {
    res.render('add_expense');
})

router.post('/',(req, res, next) => {
    req.body.user = req.user.id;
    Expense.create(req.body, (error, expense) => {
      res.redirect('/dashboard');
    })
})

module.exports = router;