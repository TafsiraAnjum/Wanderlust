const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Review = require("./reviews.js");
const Listing = require("./listings.js");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

// to delete listing and all reviews created by the user
userSchema.post("findOneAndDelete", async (user) => {
    if(user){
        await Review.deleteMany({author: user._id});
        await Listing.deleteMany({owner: user._id});    
    }
});  

const User = mongoose.model("User", userSchema);
module.exports = User;