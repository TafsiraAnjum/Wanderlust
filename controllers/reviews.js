const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let newReview = new Review(req.body.review);
    let listing = await Listing.findById(id);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${id}/show`);
}

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}/show`);
}