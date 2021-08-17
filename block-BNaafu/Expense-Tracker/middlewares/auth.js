var User = require('../models/User')
module.exports = {
    isUserLogged: (req, res, next) => {
        if(req.session && req.session.userId){
            next();
        }else{
            return res.redirect('/');
        }
    },
    userInfo: (req, res, next) => {
        var userId = req.session && req.session.userId
        if(userId){
            User.findById(userId, (error, user) => {
                req.user = user;
                res.locals.user = user;
                next();
            })
        }else{
            req.user = null;
            res.locals.user = null;
            next();
        }
    }
}