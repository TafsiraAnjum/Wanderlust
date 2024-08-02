const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const { validateReview, isLoggedin, isAuthor } = require("../middeleware.js");
const reviewControllers = require("../controllers/reviews.js");


// create reviews
router.post("/", isLoggedin, validateReview, WrapAsync(reviewControllers.createReview));

 // delete reviews
router.delete("/:reviewId", isLoggedin, isAuthor, WrapAsync(reviewControllers.deleteReview));

module.exports = router;