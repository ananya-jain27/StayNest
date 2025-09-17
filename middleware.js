const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req , res, next) => {
    // console.log(req);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in !!!")
        res.redirect("/login");
    }
    else{
        next();
    }
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.saveRedirectUrl = req.session.redirectUrl;
    }
    next(); 
};

module.exports.isOwner = async (req,res ,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of this listing");
        res.redirect(`/listings/${id}`);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res ,next) => {
    let { id ,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review");
        res.redirect(`/listings/${id}`);
    }
    else{
        next();
    }
}

// validation for listing schema 
module.exports.validateListing = (req, res, next) => {

    // "joi" is used to validate schema
    let result = listingSchema.validate(req.body);
    // console.log(result);
    // let errmsg = result.error.details.map((ele) => ele.message).join(",");
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    else {
        next();
    }
}

// validation for review schema 
module.exports.validateReview = (req ,res ,next) => {
    // "joi" is used to validate schema
    let result = reviewSchema.validate(req.body);
    console.log(result);
    // let errmsg = result.error.details.map((ele) => ele.message).join(",");
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    else {
        next();
    }
};