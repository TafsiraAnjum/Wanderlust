const Listing = require("../models/listings.js");

module.exports.newListings = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListings = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created!");
    let id = newListing._id;
    res.redirect(`/listings/${id}/show`);
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate:{path: "author"}
        }).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you're requested doesn't exist!");
        res.redirect("/");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you're requested doesn't exist!");
        res.redirect("/");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.file;
        listing.image = {url, filename};
        await listing.save();    
    }
    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}/show`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/");
}