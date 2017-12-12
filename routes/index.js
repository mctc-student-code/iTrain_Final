var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');



// GET home page aka login page
router.get('/', function(req, res, next) {
    res.render('login');
});

// Get signup page
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

// GET logout page
router.get('/logout', function(req, res, next){
    req.logout();  // passport provides this
    res.redirect('/');
});

//post to login
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

//post to signup
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// GET logout page
router.get('/logout', function(req, res, next){
    req.logout();  // passport provides this
    res.redirect('/');
});

/* Apply this middleware to every route in the file, so don't need to
specify it for every router */

router.use(isLoggedIn);

/* Middleware, to verify if the user is authenticated */
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

// POST to update profile info

router.post('/saveInfo', isLoggedIn, function(req, res, next) {
    if (req.body.date || req.body.weight || req.body.BMI || req.body.height) { //if either have been updated, then add them to req.user.userData object
        req.user.profileInfo.date = req.body.date || req.user.profileInfo.date;
        req.user.profileInfo.height = req.body.height || req.user.profileInfo.height;
        req.user.profileInfo.weight = req.body.weight || req.user.profileInfo.weight;

        var height = req.user.profileInfo.height * req.user.profileInfo.height;
        var weight = req.user.profileInfo.weight;
        var x = Math.round(weight / height * 703);

        req.user.profileInfo.BMI = x;

        res.render('profile', {
            height : height,
            weight : weight,

        });

        //save the user info to the DB
        req.user.save()
            .then( () => {
                req.flash('updateMsg', 'Your information has been saved.');
                res.redirect('/profile');
            })
            .catch( (err) => {
                if (err.name === 'Validation Error') {
                    req.flash('updateMsg', 'Your information is not valid.');
                    res.redirect('/profile');
                } else {
                    next(err);
                }
            });
         }
         else {
        req.flash('updateMsg', 'Please enter some information.');
        res.redirect('/profile');
    }

});

//get profile page
router.get('/profile', isLoggedIn, function(req, res, next) {

    res.render('profile', {
        username: req.user.local.username,
        signUpDate: req.user.signUpDate,
        profileInfo: req.user.profileInfo
    });

});

module.exports = router;
