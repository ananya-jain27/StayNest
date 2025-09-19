const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const router = express.Router();


//Index route
router.get("/", wrapAsync(listingController.index));

//New route
router.get("/new", isLoggedIn , listingController.renderNewForm);

//Create route
router.post("/", isLoggedIn , validateListing, upload.single('listing[image]'),
    wrapAsync(listingController.createListing));

//Show route
router.get("/filter/:category" , wrapAsync(listingController.filterListings));

router.get("/:id", wrapAsync(listingController.showListing));

//Edit route
router.get("/:id/edit", 
    isLoggedIn ,
    isOwner, 
    wrapAsync(listingController.renderEditForm));

//Update route
router.put("/:id", 
    isLoggedIn ,
    isOwner, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing));

//Delete route
router.delete("/:id",
    isLoggedIn ,
    isOwner,
    wrapAsync(listingController.deleteListing));

module.exports = router;