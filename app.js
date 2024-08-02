if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

// npm packages
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");

const app = express();
const path = require("path");

// Importing Files
const Listing = require("./models/listings.js");
const User = require("./models/users.js");
const ExpressError = require("./utils/ExpressError.js");
const WrapAsync = require("./utils/WrapAsync.js");
const listingRouter = require("./routers/listings.js");
const reviewRouter = require("./routers/reviews.js");
const userRouter = require("./routers/users.js");

// connecting to db
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET
  },
  touchAfter: 24 * 60 * 60
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

// built-in middlewares to set the app.
app.engine('ejs', engine);                              
app.set("view engine", "ejs");                          
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(session(sessionOptions));        //used session to store the interaction btw client & server.
app.use(flash());                        //to flash some alerts.
app.use(passport.initialize());                            //used passport and other related
app.use(passport.session());                               //npm packages to 
passport.use(new localStrategy(User.authenticate()));     //authenticate and authorized users.
passport.serializeUser(User.serializeUser());             //to save user's info into session
passport.deserializeUser(User.deserializeUser());         //to remove user's info from session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

  //Index Home Route
app.get("/", WrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/", userRouter);

app.get("/search", WrapAsync(async (req, res) => {
  let {query} = req.query;
  if(query) {
    let listings = await Listing.find({title: { $regex: query, $options: 'i'}});
    res.render("listings/searched.ejs", {listings, query});  
  } else{
    res.redirect("/");
  }
}));

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// error-handling function
app.use((err, req, res, next) => {
  let {status=500, message="Something went wrong"} = err;
  res.status(status).render("error.ejs", { message });
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});