const express = require("express");
const port = 5000;
const path = require("path");
//db connection
require("./db/db");
const User = require("./models/users");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./config/passport")(passport);
const { checkAuth } = require("./config/auth");
const app = express();
require("dotenv").config();

const public = path.join(__dirname, "./public");

app.use(express.json());
app.use(express.static(public));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/signup");
});
app.get("/home", checkAuth, (req, res) => {
  res.render("Home");
});

app.get("/signup", (req, res) => {
  res.render("Signin");
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/signup", async (req, res) => {
  const { username, pass } = req.body;
  let error = [];

  if (username.length === 0 || pass.length === 0) {
    error.push({ msg: "Please the provide username and password" });
  }

  if (error.length > 0) {
    res.render("Signin", {
      error: error,
      username: username,
      pass: pass,
    });
  } else {
    User.findOne({ username: username }).then((user) => {
      if (user) {
        error.push({ msg: "Username already exists" });
        res.render("Signin", {
          error: error,
          username: username,
          pass: pass,
        });
      } else {
        const newUser = new User({
          username: username,
          password: pass,
        });
        newUser
          .save()
          .then((user) => {
            req.flash("success_msg", "Thanks for Registering ");
            res.redirect("/Home");
          })
          .catch((e) => console.log(e));
      }
    });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/Home",
    failureRedirect: "/Login",
    failureFlash: true,
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "you are logged out");
  res.redirect("/Login");
});

app.listen(port, () => {
  console.log("server listening on port", port);
});
