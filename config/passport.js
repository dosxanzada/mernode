const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')

const User = require('../models/user');
const config = require('../config/database');

module.exports = function (passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        // Match Username
        let query = {username: username};
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message:'Мұндай пайдаланушы жүйеде тіркелмеген'});
            }

            // Match Password
            bcrypt.compare(password, user.password, function (err, isMathc) {
                if (err) throw err;
                if (isMathc) {
                    return done(null, user);
                }else{
                    return done(null, false, {message:'Құпиясөз қате'});
                }
            });
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) { 
        User.findById(id, function (err, user) { 
            done(err, user);
         });
     });
}