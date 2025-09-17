const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview =  async (req,res) => {
    let review = req.body.review;
    let newReview = new Review(review);
    newReview.author = req.user._id;
    await newReview.save();

    let listing = await Listing.findById(req.params.id);
    listing.reviews.push(newReview);
    await listing.save();

    console.log("new review saved");
    req.flash("success" , "New Review added");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.deleteReview = async (req,res) => {
    let {id , reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    req.flash("success" , "Review Deleted");
    res.redirect(`/listings/${id}`);

}