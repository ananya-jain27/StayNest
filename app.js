if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
 
//connection build with mongoDB 

// const mongo_URL = "mongodb://127.0.0.1:27017/staynest"
let dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("connection build");
})
.catch((err) => {
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookies : {
        expires : Date.now() * 7 * 24 * 60 * 60 *1000 , 
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true,
    },
    store: MongoStore.create(
        {
            mongoUrl :  dbUrl,
            crypto : {
                secret: process.env.SECRET
            },
            touchAfter : 24 * 60 * 60
            
        }
        
    )
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req , res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});


// Root route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// listings
app.use("/listings" , listingRouter);

// Reviews
app.use("/listings/:id/reviews" , reviewRouter);

// users
app.use("/" , userRouter);


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !!!"));
});

// Error Handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong !!!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    // res.status(statusCode).send(message);
})
// Server start
app.listen(8080, () => {
    console.log("app listening at port 8080");
});