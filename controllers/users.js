const User = require("../models/users.js");

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signedUp = async (req, res) => {
    try{
        let { username, email, password} = req.body;
        let newUser = await User({email, username});
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/");
        });
            
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loggedIn = async (req, res, next) => {
    req.flash("success", "Welcome back to Wanderlust");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    } else{
        res.redirect("/");
    }
};

module.exports.loggedOut = async (req, res) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You're logged out!");
        res.redirect("/");
    });
};

module.exports.deleteAccount = (req, res) => {
    res.render("users/acc-delete.ejs");
};

module.exports.closedAccount = async (req, res) => {
    let {username} = req.body;
    await User.findOneAndDelete({username: username});
    req.flash("success", "We're sorry to let you go!")
    res.redirect("/");
};