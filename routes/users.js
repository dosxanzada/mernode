const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');

let User = require("../models/user");
let Article = require('../models/article');

// Register Form
router.get("/register", function (req, res) {
    res.render("register", {
        title: "Жаңа пайдаланушы тіркелу"
    });
});

// Register Process
router.post("/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const email = req.body.email;
    const role = req.body.role;

    console.log("request username: ", req.body.username);
    console.log("request password: ", req.body.password);
    console.log("request role: ", req.body.role);

    // let query = {username: username};
    //     User.findOne(query, function (err, user) {
    //         if (err) throw err;
    //         if (!user) {
    //             return done(null, false, {message:'Мұндай пайдаланушы жүйеде тіркелмеген'});
    //         }
    //     });
    // req.checkBody('username', 'Такой пользователь существует').equals(userUni);
    req.checkBody('password', 'Құпиясөз теріңіз').notEmpty();
    req.checkBody('role', 'Пайдаланушы рөлін таңдаңыз').notEmpty();
    req.checkBody('confirmPassword', 'Құпиясөз сәйкес келмейді').equals(req.body.password);
    req.checkBody('email', 'Электронды пошта теріңіз').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render("register", {
            errors: errors
        });
    } else {
        let newUser = new User({
            username: username,
            password: password,
            email: email,
            role: role
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }

                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash("success", "Сәтті тіркелдіңіз");
                        res.redirect("/users/login");
                    }
                });
            });
        });
    }
});

// Login Form
router.get("/login", function (req, res) {
    res.render("login", {
        title: "Жүйеге кіру"
    });
});

// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/users/adminpage',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// User Logout
router.get('/logout', function (req, res){
    req.logout();
    req.flash('warning', 'Жүйеден шықтыңыз');
    res.redirect('/');
});

// Admin Form
router.get("/adminpage", function (req, res) {
    console.log(req.params.id);
    Article.find({}, function (err, articles) {
        if (err){
            console.log(err);
        } else {
            res.render("admin_page", {
                title: "Пайдаланушы парақшасы",
                articles: articles
            });
        }
    });


    // Article.find({}, function (err, articles) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render("index", {
    //             title: "SmartBilim - қашықтықтан оқытуды басқару",
    //             articles: articles
    //         });
    //     }
    // });

    // Article.findById(req.params.id, function (err, article) {
    //     const img = Article.findById(req.params.id)
    //         .select('name _id articleImage')
    //     User.findById(article.author, function (err, user) {
    //         res.render('admin_page', {
    //             title: 'Пайдаланушы парақшасы',
    //             article: article,
    //             author: user.username,
    //             articleImg: img,
    //         });
    //     });
    // });
});

// Request - Updated User
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    User.findById(req.params.id, function (err, user) {
        res.render('update_user', {
            title: 'Пайдаланушы профилін өзгерту',
            user: user
        });
    });
});

// Updated User
router.post('/edit/:id', function (req, res) {
    const role = req.body.role;
    let user = {};

    user.username = req.body.username;
    user.email = req.body.email;
    user.role = req.body.role;
    user.lastName = req.body.lastName;
    user.firstName = req.body.firstName;
    user.dateBirth = req.body.dateBirth;

    let query = {
        _id: req.params.id
    };

    req.checkBody('role', 'Пайдаланушы рөлін таңдаңыз').notEmpty();

    User.update(query, user, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Профиль өзгертілді');
            res.redirect('/users/adminpage');
        }
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Жалғастыру үшін жүйеге кіріңіз');
        res.redirect('/users/login');
    }
}

module.exports = router;