const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res) => {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.login(registeredUser , (err) => {
            if(err){
                next(err);
            }
            req.flash("success" , "Welcome to StayNest");
            res.redirect("/listings");
        });
        
    }
    catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = (req , res) => {
    req.flash("success" , "Welcome back to StayNest");
    let redirectUrl = res.locals.saveRedirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "Logged out Successfully !");
        res.redirect("/listings");
    });

}