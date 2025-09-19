const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};
module.exports.filterListings = async (req , res) => {
    let {category} = req.params;
    const filteredListings = await Listing.find({category : category});
    if(!filteredListings) {
        req.flash("error" , " Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/filter.ejs" , { filteredListings });

}
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",
        populate : {path : "author"} }).populate("owner");
    if(!listing) {
        req.flash("error" , " Listing does not exist");
        res.redirect("/listings");
    }
    else{
        res.render("listings/show.ejs", { listing });
    }  
};

module.exports.createListing = async (req, res) => {

        // let {title,description,image,price,location,country} =req.body;
        let url = req.file.path;
        let filename = req.file.filename;

        let listing = req.body.listing;
        const l1 = new Listing(listing);
        l1.image = {url , filename};
        l1.owner = req.user._id;
        await l1.save();
        req.flash("success" , "New Listing added");
        res.redirect("/listings");

};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , " Listing does not exist");
        res.redirect("/listings");
    }

        // let originalImageUrl = listing.image.url ; 
        // originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
        res.render("listings/edit.ejs", { listing });
 
};

module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
        // let newListing = req.body.listing;
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

        if (req.file){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url , filename};
            await listing.save();
        }
        req.flash("success" , " Listing updated");
        res.redirect(`/listings/${id}`);

};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success" , "Listing deleted");
    res.redirect("/listings");

};