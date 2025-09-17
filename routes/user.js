const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

const router = express.Router();

// SignUp Route
router.get("/signup" , userController.renderSignupForm);

router.post("/signup" ,wrapAsync (userController.signup));

// Login Route
router.get("/login" , userController.renderLoginForm);

router.post("/login" , 
    saveRedirectUrl ,
    passport.authenticate("local" , { failureRedirect: '/login' , failureFlash :true}) , 
    userController.login);

// Logout Route
router.get("/logout" , userController.logout);

module.exports = router;