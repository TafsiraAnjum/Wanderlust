const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listings.js");
const Review = require("./models/reviews.js");

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

module.exports.validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else{
        next();
    };
};

module.exports.isLoggedin = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login to continue!");
    res.redirect("/login");
  } else{
    next();
  }
};

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req, res, next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not permitted to go further!");
    return res.redirect(`/listings/${id}/show`);
  }
  next();
};

module.exports.isAuthor = async(req, res, next) => {
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not author of the review!");
    return res.redirect(`/listings/${id}/show`);
  }
  next();
};