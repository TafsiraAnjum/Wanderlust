const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const {saveRedirectUrl, isLoggedin} = require("../middeleware.js");
const passport = require("passport");
const userControllers = require("../controllers/users.js");



router.get("/signup", userControllers.signupForm);

router.post("/signup", WrapAsync(userControllers.signedUp));

router.get("/login", userControllers.loginForm);

router.post('/login', saveRedirectUrl, passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), 
    WrapAsync(userControllers.loggedIn)
);

router.get("/logout", WrapAsync(userControllers.loggedOut));

router.get("/account-delete", isLoggedin, userControllers.deleteAccount);

router.post("/account-delete", passport.authenticate('local', {
    failureRedirect: '/account-delete',
    failureFlash: true
    }), 
    WrapAsync(userControllers.closedAccount));

module.exports = router;