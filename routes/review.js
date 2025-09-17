const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview , isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

const router = express.Router({mergeParams : true});

// Reviews - post route
router.post("/" ,validateReview , 
    isLoggedIn , 
    wrapAsync(reviewController.createReview));

// Reviews - Delete route
router.delete("/:reviewId" , 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync (reviewController.deleteReview ));

module.exports = router;