const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const { validateListing, isLoggedin, isOwner } = require("../middeleware.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../CloudConfig.js");
const upload = multer({ storage });


// create new listing
router.route("/new")
    .get(isLoggedin, (listingControllers.newListings))
    .post(
        upload.single("listing[image]"), isLoggedin, validateListing, WrapAsync(listingControllers.createListings
    ));

// show a listing
router.get("/:id/show", WrapAsync(listingControllers.showListing));

// edit a listing
router.route("/:id/edit")
    .get(isLoggedin, isOwner, WrapAsync(listingControllers.editListing))
    .put(
        upload.single("listing[image]"), isLoggedin, isOwner, validateListing, WrapAsync(listingControllers.updateListing
    ));

//Delete Route
router.delete("/:id/delete", isLoggedin, isOwner, WrapAsync(listingControllers.deleteListing));
    

module.exports = router;