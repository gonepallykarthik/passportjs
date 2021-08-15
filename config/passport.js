const localstrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/users");

module.exports = function (passport) {
  passport.use(
    new localstrategy(
      { usernameField: "username" },
      (username, password, done) => {
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "Email is not registered" });
            }

            //check the password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                throw new err();
              } else {
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: "Incorrect password" });
                }
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
