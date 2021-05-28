const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  passport.use(new LocalStrategy(function(username, password,done){

    let query = {username:username};
    User.findOne(query, function(err, User){
      if(err) throw err;
      if(!User){
        return done(null, false, {message: 'No User Found'});
      }

      bcrypt.compare(password, User.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, User);
        } else {
            return done(null, false, {message: 'Wrong Password'});
        }
      });
    });
    }));

    passport.serializeUser(function(User, done) {
  done(null, User.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, User) {
    done(err, User);
  });
});
}
